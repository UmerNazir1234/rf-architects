"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
  getCartSubtotal,
  type CartItem,
} from "@/lib/cart";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";

function formatVariant(variant?: Record<string, string>) {
  if (!variant || Object.keys(variant).length === 0) return "Default";
  return Object.entries(variant)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}

function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString()}`;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);

  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 sm:text-4xl">
              Shop Cart
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Review items before checkout
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-600">Your cart is empty.</p>
            <Link
              href="/shop"
              className="mt-4 inline-flex rounded-sm bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-black"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-4">
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;
                return (
                  <div
                    key={item.cartItemId}
                    className="relative rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
                  >
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-red-500"
                      onClick={() => setItems(removeCartItem(item.cartItemId))}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-24 w-24 shrink-0 rounded-lg object-cover"
                      />

                      <div className="min-w-0 flex-1 pr-8">
                        <h2 className="font-semibold text-gray-900">
                          {item.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatPrice(item.price)} each
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Variant: {formatVariant(item.variant)}
                        </p>

                        <div className="mt-4 inline-flex items-center rounded-lg border border-gray-200">
                          <button
                            type="button"
                            className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                            onClick={() =>
                              setItems(
                                updateCartItemQuantity(
                                  item.cartItemId,
                                  item.quantity - 1
                                )
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-8 px-2 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                            onClick={() =>
                              setItems(
                                updateCartItemQuantity(
                                  item.cartItemId,
                                  item.quantity + 1
                                )
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right sm:min-w-[100px]">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Taxes and fees are finalized at checkout.
              </p>
              <Link
                href="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-sm bg-gray-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-black"
              >
                Proceed to checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
