"use client";

import LoadingSpinner from "@/app/_components/loading-spinner";
import { cartUtils, type CartItem } from "@/utils/cart";
import {
  checkoutErrorResponseSchema,
  checkoutResponseSchema,
} from "@/utils/cart-schema";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<{ items: CartItem[] }>({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setCart(cartUtils.getCart());
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleRemoveItem = (itemId: string) => {
    cartUtils.removeFromCart(itemId);
    setCart(cartUtils.getCart());
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    cartUtils.updateQuantity(itemId, quantity);
    setCart(cartUtils.getCart());
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCheckout = async () => {
    if (!cart.items.length) return;

    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems: cart.items }),
      });

      const payload: unknown = await response.json();

      if (!response.ok) {
        const parsedError = checkoutErrorResponseSchema.safeParse(payload);
        throw new Error(
          parsedError.success
            ? parsedError.data.error
            : "Failed to start checkout",
        );
      }

      const parsedPayload = checkoutResponseSchema.safeParse(payload);
      if (!parsedPayload.success) {
        throw new Error("Invalid checkout response");
      }

      window.location.assign(parsedPayload.data.checkoutUrl);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (cart.items.length === 0) {
    return (
      <main className="flex size-full min-h-screen flex-col items-center justify-center bg-primary-900">
        <section className="container size-full bg-primary-900 px-4 py-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="gradient-text mb-8 font-headline text-4xl lg:text-5xl">
              Your Cart
            </h1>
            <div className="rounded-lg border border-secondary-800/20 bg-surface-100 p-12">
              <div className="mb-4 text-6xl">🛒</div>
              <h2 className="mb-4 font-subhead text-2xl text-headings">
                Your cart is empty
              </h2>
              <p className="mb-8 text-body">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Link
                href="/#merch"
                className="inline-flex rounded-lg bg-accent px-6 py-3 font-subhead text-primary-900 transition-colors duration-200 hover:bg-accent/80"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <main className="flex size-full min-h-screen flex-col items-center justify-center gap-2 bg-primary-900">
      <section className="container flex size-full flex-col items-center justify-center gap-2 bg-primary-900 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="gradient-text mb-8 font-headline text-4xl lg:text-5xl">
            Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-secondary-800/20 bg-surface-100 p-4"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative aspect-square w-20 overflow-hidden rounded-lg border border-secondary-800/20 bg-surface">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-body/30">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-subhead text-headings">
                        {item.name}
                      </h3>
                      <p className="text-sm text-body/60">
                        {item.typeName}
                        {item.size && ` • Size: ${item.size}`}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-subhead text-headings">
                          €{(item.price / 100).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="rounded border border-secondary-800/20 bg-surface px-2 py-1 text-headings hover:bg-surface-100 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="min-w-[2rem] text-center text-body">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="rounded border border-secondary-800/20 bg-surface px-2 py-1 text-headings hover:bg-surface-100"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="ml-2 text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="font-subhead text-headings">
                        €{((item.price * item.quantity) / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-secondary-800/20 bg-surface-100 p-6">
                <h2 className="mb-4 font-subhead text-headings">
                  Order Summary
                </h2>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-body">
                    <span>Subtotal</span>
                    <span>€{(totalPrice / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-body">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-secondary-800/20 pt-2">
                    <div className="flex justify-between font-subhead text-headings">
                      <span>Total</span>
                      <span>€{(totalPrice / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full rounded-lg bg-accent px-6 py-3 font-subhead text-primary-900 transition-colors duration-200 hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-900 border-t-transparent"></div>
                      Processing...
                    </span>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>

                <Link
                  href="/#merch"
                  className="mt-3 block w-full rounded-lg border border-secondary-800/20 bg-surface px-6 py-3 text-center font-subhead text-headings transition-colors duration-200 hover:bg-surface-100"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
