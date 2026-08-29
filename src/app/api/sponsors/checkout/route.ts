import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { env } from "@/env";
import { db } from "@/server/db";
import { stripe } from "@/server/stripe";
import { uploadSponsorLogo } from "@/server/sponsor-upload";

const checkoutSchema = z.object({
  slotId: z.string().min(1).max(191),
  advertiserName: z.string().trim().min(2).max(80),
  advertiserEmail: z.string().trim().email().max(191),
  websiteUrl: z
    .string()
    .trim()
    .url()
    .max(191)
    .refine((value) => ["http:", "https:"].includes(new URL(value).protocol), {
      message: "Website URL must use http or https.",
    }),
  expectedAmount: z.coerce.number().int().positive(),
  businessConfirmation: z.literal("true"),
  termsAccepted: z.literal("true"),
  outbidConfirmation: z.literal("true"),
});

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function POST(request: NextRequest) {
  let pendingBidId: string | undefined;

  try {
    const formData = await request.formData();
    const parsed = checkoutSchema.safeParse({
      slotId: formValue(formData, "slotId"),
      advertiserName: formValue(formData, "advertiserName"),
      advertiserEmail: formValue(formData, "advertiserEmail"),
      websiteUrl: formValue(formData, "websiteUrl"),
      expectedAmount: formValue(formData, "expectedAmount"),
      businessConfirmation: formValue(formData, "businessConfirmation"),
      termsAccepted: formValue(formData, "termsAccepted"),
      outbidConfirmation: formValue(formData, "outbidConfirmation"),
    });
    const logo = formData.get("logo");

    if (!parsed.success || !(logo instanceof File)) {
      return NextResponse.json(
        {
          error:
            parsed.error?.issues[0]?.message ?? "Please choose a logo file.",
        },
        { status: 400 },
      );
    }

    const slot = await db.sponsorSlot.findFirst({
      where: { id: parsed.data.slotId, enabled: true },
      include: { currentBid: { select: { amount: true } } },
    });

    if (!slot) {
      return NextResponse.json(
        { error: "This sponsor spot is not available." },
        { status: 404 },
      );
    }

    const nextAmount = slot.currentBid
      ? slot.currentBid.amount + slot.minIncrement
      : slot.basePrice;

    if (parsed.data.expectedAmount !== nextAmount) {
      return NextResponse.json(
        {
          error: "That spot has a new price. Please review the updated bid.",
          nextAmount,
        },
        { status: 409 },
      );
    }

    const logoUrl = await uploadSponsorLogo(logo);
    const bid = await db.sponsorBid.create({
      data: {
        slotId: slot.id,
        advertiserName: parsed.data.advertiserName,
        advertiserEmail: parsed.data.advertiserEmail,
        websiteUrl: parsed.data.websiteUrl,
        logoUrl,
        amount: nextAmount,
      },
    });
    pendingBidId = bid.id;

    const session = await stripe.checkout.sessions.create({
      client_reference_id: `sponsor_${bid.id}`,
      customer_email: bid.advertiserEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Sponsor spot · ${slot.name}`,
              description:
                "Your logo stays live until another sponsor outbids this placement. A Mio mystery care package is included.",
            },
            unit_amount: bid.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/sponsors/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/#sponsors`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      metadata: {
        checkoutType: "sponsor",
        sponsorBidId: bid.id,
        sponsorSlotId: slot.id,
        businessConfirmation: "true",
        termsAccepted: "true",
        termsVersion: "2026-08-29",
        outbidConfirmation: "true",
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    await db.sponsorBid.update({
      where: { id: bid.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    if (pendingBidId) {
      await db.sponsorBid
        .updateMany({
          where: { id: pendingBidId, status: "PENDING" },
          data: { status: "CANCELLED" },
        })
        .catch((updateError) =>
          console.error("Could not cancel sponsor bid:", updateError),
        );
    }

    console.error("Sponsor checkout failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Sponsor checkout failed.",
      },
      { status: 500 },
    );
  }
}
