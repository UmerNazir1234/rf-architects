"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { CART_UPDATED_EVENT, getCartItemCount } from "@/lib/cart";

export function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(getCartItemCount());
    refresh();
    window.addEventListener(CART_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <Link
      href="/cart"
      className="relative inline-flex p-2 text-gray-800 transition-colors hover:text-gray-600"
      aria-label={`Cart${count > 0 ? `, ${count} items` : ""}`}
    >
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
