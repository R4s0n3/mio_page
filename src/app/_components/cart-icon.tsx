"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cartUtils } from "@/utils/cart";

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0);

  const updateItemCount = () => {
    setItemCount(cartUtils.getTotalItems());
  };

  useEffect(() => {
    updateItemCount();

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "mio_cart") {
        updateItemCount();
      }
    };

    // Listen for custom cart events
    const handleCartUpdate = () => updateItemCount();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <Link href="/cart" className="group relative">
      <ShoppingBagIcon className="size-6 transition-colors duration-200 group-hover:text-accent" />
      {itemCount > 0 && (
        <span className="absolute -right-2 -top-1 flex size-5 items-center justify-center rounded-full bg-accent p-1 font-subhead text-xs text-primary-900">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
