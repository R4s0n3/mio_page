import { randomUUID } from "node:crypto";

import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

import { env } from "@/env";
import { db } from "@/server/db";
import { stripe } from "@/server/stripe";
import {
  checkoutRequestSchema,
  type CheckoutCartItem,
} from "@/utils/cart-schema";

const allowedSizes = new Set(["XS", "S", "M", "L", "XL", "XXL"]);

class CheckoutInputError extends Error { }

function toStripeImageUrl(image: string | null | undefined) {
  if (!image) return undefined;

  try {
    const url = new URL(image, env.NEXT_PUBLIC_BASE_URL);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}

function mergeCartItems(cartItems: CheckoutCartItem[]) {
  const mergedItems = new Map<string, CheckoutCartItem>();

  for (const item of cartItems) {
    const key = `${item.productId}:${item.size ?? ""}`;
    const existingItem = mergedItems.get(key);

    mergedItems.set(key, {
      productId: item.productId,
      size: item.size,
      quantity: (existingItem?.quantity ?? 0) + item.quantity,
    });
  }

  return [...mergedItems.values()];
}

export async function POST(request: NextRequest) {
  let pendingOrderId: string | undefined;

  try {
    const payload: unknown = await request.json();
    const parsedPayload = checkoutRequestSchema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        { error: "Invalid cart payload" },
        { status: 400 },
      );
    }

    const cartItems = mergeCartItems(parsedPayload.data.cartItems);

    if (cartItems.some((item) => item.quantity > 99)) {
      return NextResponse.json(
        { error: "Cart item quantity is too high" },
        { status: 400 },
      );
    }

    const productIds = [...new Set(cartItems.map((item) => item.productId))];
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        deletedAt: null,
      },
      include: {
        type: true,
      },
    });
    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );

    const orderItems = cartItems.map((item) => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new CheckoutInputError("Cart contains an unavailable product");
      }

      const requiresSize = product.type.name === "T-SHIRT";
      if (requiresSize && !item.size) {
        throw new CheckoutInputError(
          `Please select a size for ${product.name}`,
        );
      }

      if (item.size && !allowedSizes.has(item.size)) {
        throw new CheckoutInputError(
          `Invalid size selected for ${product.name}`,
        );
      }

      return {
        item,
        product,
      };
    });

    const order = await db.order.create({
      data: {
        cartRef: `checkout_${randomUUID()}`,
        status: "PENDING",
        items: {
          create: orderItems.map(({ item, product }) => ({
            productId: product.id,
            qty: item.quantity,
            size: item.size,
          })),
        },
      },
      select: {
        id: true,
        cartRef: true,
      },
    });
    pendingOrderId = order.id;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      orderItems.map(({ item, product }) => {
        const descriptionParts = [product.type.name];
        if (item.size) descriptionParts.push(`Size: ${item.size}`);

        const imageUrl = toStripeImageUrl(product.image);

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.name,
              description: descriptionParts.join(" - "),
              images: imageUrl ? [imageUrl] : undefined,
            },
            unit_amount: product.price,
          },
          quantity: item.quantity,
        };
      });

    const session = await stripe.checkout.sessions.create({
      client_reference_id: order.cartRef,
      line_items: lineItems,
      mode: "payment",
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/cart`,
      shipping_address_collection: {
        allowed_countries: [
          "DE",
          "AT",
          "CH",
          "NL",
          "BE",
          "FR",
          "IT",
          "ES",
          "PT",
        ],
      },
      metadata: {
        orderId: order.id,
        cartRef: order.cartRef,
      },
    });

    await db.order.update({
      where: { id: order.id },
      data: { shopId: session.id },
    });

    if (!session.url) {
      throw new Error("Stripe checkout session did not include a URL");
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    if (pendingOrderId) {
      try {
        await db.order.update({
          where: { id: pendingOrderId },
          data: { status: "CANCELLED" },
        });
      } catch (updateError) {
        console.error("Failed to cancel pending checkout order:", updateError);
      }
    }

    const isInputError = error instanceof CheckoutInputError;
    const message =
      isInputError && error.message
        ? error.message
        : "Failed to create checkout session";

    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: message },
      { status: isInputError ? 400 : 500 },
    );
  }
}
