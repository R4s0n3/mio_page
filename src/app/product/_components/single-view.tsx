"use client";

import { api } from "@/trpc/react";
import LoadingSpinner from "@/app/_components/loading-spinner";
import { useState } from "react";
import { cartUtils } from "@/utils/cart";
import ProductImages from "./product-images";

export default function SingleView({ pid }: { pid?: string }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Common size options
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const fetchedView = api.product.getView.useQuery(
    { id: pid ?? "" },
    {
      enabled: !!pid,
    },
  );
  const product = fetchedView?.data;

  const handleAddToCart = () => {
    if (!product) return;

    const size = selectedSize.trim() === "" ? undefined : selectedSize;

    if (!size && product.type.shippable && product.type.name === "T-SHIRT") {
      alert("Please select a size for this product");
      return;
    }

    setIsAddingToCart(true);

    try {
      cartUtils.addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image ?? undefined,
          typeName: product.type.name,
        },
        quantity,
        size,
      );

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("cartUpdated"));

      setIsAddingToCart(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setIsAddingToCart(false);
      console.error("Failed to add to cart:", error);
    }
  };

  if (!product || fetchedView?.isPending) return <LoadingSpinner />;

  const { name, description, detailImages, price, type } = product;

  const images = [
    product.image,
    ...detailImages.map((detailImage) => detailImage.imageUrl),
  ].filter(
    (image, index, allImages): image is string =>
      Boolean(image) && allImages.indexOf(image) === index,
  );

  const hasSizes = type.name === "T-SHIRT";

  return (
    <section className="container mx-auto size-full px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <ProductImages name={name} images={images} />
        {/* Product Details */}
        <div className="flex flex-col gap-6">
          {/* Product Name */}
          <h1 className="gradient-text font-headline text-4xl lg:text-6xl">
            {name}
          </h1>

          {/* Product Type Badge */}
          {type && (
            <div className="inline-flex items-center gap-2">
              <span className="rounded-full bg-accent/20 px-3 py-1 font-subhead text-sm text-accent">
                {type.name}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <div className="font-subhead text-4xl text-headings">
              €{(price / 100).toFixed(2)}
            </div>
            <div className="text-sm text-body/60">EUR</div>
          </div>
          {/* Description */}
          {description && (
            <div className="prose prose-invert max-w-none">
              <h3 className="font-subhead text-headings">Description</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-body">
                {description}
              </p>
            </div>
          )}

          {/* Product Specifications */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-secondary-800/20 bg-surface-100 p-4">
            <div className="flex flex-col gap-1">
              <span className="font-subhead text-xs text-headings/60">
                Availability
              </span>
              <span className="font-subhead text-highlight-green">
                In Stock
              </span>
            </div>
          </div>

          {/* Size Selector */}
          {hasSizes && type.shippable && (
            <div className="space-y-3">
              <span className="font-subhead text-headings">Size:</span>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg border px-4 py-2 font-subhead transition-all duration-200 ${
                      selectedSize === size
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-secondary-800/20 bg-surface text-headings hover:bg-surface-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-subhead text-headings">Quantity:</span>
            <div className="flex items-center rounded-lg border border-secondary-800/20 bg-surface">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-headings transition-colors hover:bg-surface-100 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="min-w-[3rem] px-4 py-2 text-center font-subhead text-headings">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-headings transition-colors hover:bg-surface-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="rounded-lg border border-highlight-green/30 bg-highlight-green/20 p-3 text-center">
              <span className="font-subhead text-highlight-green">
                ✓ Added to cart successfully!
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 rounded-lg bg-accent px-6 py-4 font-subhead text-primary-900 transition-all duration-200 hover:scale-105 hover:bg-accent/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-900 border-t-transparent"></div>
                  adding...
                </span>
              ) : (
                "🛒 Add to Cart"
              )}
            </button>
            <button className="rounded-lg border border-secondary-800/20 bg-surface px-6 py-4 font-subhead text-headings transition-all duration-200 hover:scale-105 hover:bg-surface-100 active:scale-95">
              ❤️ Save for Later
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-3 pt-4">
            <div className="flex items-center gap-2 text-xs text-body/60">
              <span className="text-highlight-green">✓</span>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-body/60">
              <span className="text-highlight-green">✓</span>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-body/60">
              <span className="text-highlight-green">✓</span>
              <span>Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
