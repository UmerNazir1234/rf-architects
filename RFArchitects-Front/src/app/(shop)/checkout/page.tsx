"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCartItems,
  getCartSubtotal,
  clearCart,
  type CartItem,
} from "@/lib/cart";
import { Site } from "@/lib/site";

function formatVariant(variant?: Record<string, string>) {
  if (!variant || Object.keys(variant).length === 0) return "Default";
  return Object.entries(variant)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}

function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString()}`;
}

const inputClass =
  "w-full rounded-sm border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-700";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    orderType: "Pickup",
    pickupDate: "",
    pickupTime: "",
    addressName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    company: "",
    apartment: "",
    country: "Pakistan",
    billingAddressName: "",
    billingStreetAddress: "",
    billingCity: "",
    billingState: "",
    billingPostalCode: "",
    billingCompany: "",
    billingApartment: "",
    billingCountry: "Pakistan",
  });

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const billing = sameAsShipping
      ? {
          addressName: form.addressName,
          streetAddress: form.streetAddress,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          company: form.company,
          apartment: form.apartment,
          country: form.country,
        }
      : {
          addressName: form.billingAddressName,
          streetAddress: form.billingStreetAddress,
          city: form.billingCity,
          state: form.billingState,
          postalCode: form.billingPostalCode,
          company: form.billingCompany,
          apartment: form.billingApartment,
          country: form.billingCountry,
        };

    const lines = [
      "Hi RF Architects, I would like to place an order.",
      "",
      "=== CUSTOMER DETAILS ===",
      `First Name: ${form.firstName}`,
      `Last Name: ${form.lastName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Order Type: ${form.orderType}`,
      ...(form.orderType === "Pickup"
        ? [
            `Pickup Date: ${form.pickupDate || "Not specified"}`,
            `Pickup Time: ${form.pickupTime || "Not specified"}`,
          ]
        : []),
      "",
      "=== SHIPPING ADDRESS ===",
      `Address Name: ${form.addressName}`,
      `Street Address: ${form.streetAddress}`,
      `City: ${form.city}`,
      `State: ${form.state}`,
      `Postal Code: ${form.postalCode}`,
      `Company: ${form.company || "N/A"}`,
      `Apartment/Suite: ${form.apartment || "N/A"}`,
      `Country: ${form.country}`,
      "",
      "=== BILLING ADDRESS ===",
      sameAsShipping
        ? "Same as shipping address"
        : [
            `Address Name: ${billing.addressName}`,
            `Street Address: ${billing.streetAddress}`,
            `City: ${billing.city}`,
            `State: ${billing.state}`,
            `Postal Code: ${billing.postalCode}`,
            `Company: ${billing.company || "N/A"}`,
            `Apartment/Suite: ${billing.apartment || "N/A"}`,
            `Country: ${billing.country}`,
          ].join("\n"),
      "",
      "=== ORDER ITEMS ===",
      ...items.map((item, index) => {
        const lineTotal = item.price * item.quantity;
        return [
          `${index + 1}. ${item.name}`,
          `   Qty: ${item.quantity}`,
          `   Variant: ${formatVariant(item.variant)}`,
          `   Price: ${formatPrice(item.price)} each`,
          `   Line Total: ${formatPrice(lineTotal)}`,
        ].join("\n");
      }),
      "",
      `Subtotal: ${formatPrice(subtotal)}`,
      `Total Items: ${totalItems}`,
    ];

    const message = lines.join("\n");
    const url = `https://wa.me/${Site.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    setItems([]);
    router.push("/shop");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-600">Your cart is empty. Add products before checkout.</p>
          <Link
            href="/shop"
            className="mt-4 inline-flex rounded-sm bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-black"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            {/* Order Items */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  1
                </span>
                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-4 rounded-lg border border-gray-100 p-3"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                      <p className="text-sm text-gray-500">
                        Variant: {formatVariant(item.variant)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Customer Details */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  2
                </span>
                <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input
                    required
                    className={inputClass}
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input
                    required
                    className={inputClass}
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    required
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone *</label>
                  <input
                    required
                    type="tel"
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Order Type</label>
                  <select
                    className={inputClass}
                    value={form.orderType}
                    onChange={(e) => updateField("orderType", e.target.value)}
                  >
                    <option value="Pickup">Pickup</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
                {form.orderType === "Pickup" && (
                  <>
                    <div />
                    <div>
                      <label className={labelClass}>Pickup Date</label>
                      <input
                        type="date"
                        className={inputClass}
                        value={form.pickupDate}
                        onChange={(e) => updateField("pickupDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Pickup Time</label>
                      <input
                        type="time"
                        className={inputClass}
                        value={form.pickupTime}
                        onChange={(e) => updateField("pickupTime", e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Shipping Address */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  3
                </span>
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Address Name *</label>
                  <input
                    required
                    className={inputClass}
                    placeholder="Home, office, pickup desk"
                    value={form.addressName}
                    onChange={(e) => updateField("addressName", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Street Address *</label>
                  <input
                    required
                    className={inputClass}
                    value={form.streetAddress}
                    onChange={(e) => updateField("streetAddress", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>City *</label>
                  <input
                    required
                    className={inputClass}
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>State *</label>
                  <input
                    required
                    className={inputClass}
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Postal Code *</label>
                  <input
                    required
                    className={inputClass}
                    value={form.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Country *</label>
                  <select
                    required
                    className={inputClass}
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Company</label>
                  <input
                    className={inputClass}
                    value={form.company}
                    onChange={(e) => updateField("company", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Apartment, Suite, etc.</label>
                  <input
                    className={inputClass}
                    value={form.apartment}
                    onChange={(e) => updateField("apartment", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Billing Address */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  4
                </span>
                <h2 className="text-lg font-semibold text-gray-900">Billing Address</h2>
              </div>
              <label className="mb-4 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Same as shipping
              </label>

              {!sameAsShipping && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Address Name *</label>
                    <input
                      required
                      className={inputClass}
                      value={form.billingAddressName}
                      onChange={(e) => updateField("billingAddressName", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Street Address *</label>
                    <input
                      required
                      className={inputClass}
                      value={form.billingStreetAddress}
                      onChange={(e) => updateField("billingStreetAddress", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>City *</label>
                    <input
                      required
                      className={inputClass}
                      value={form.billingCity}
                      onChange={(e) => updateField("billingCity", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <input
                      required
                      className={inputClass}
                      value={form.billingState}
                      onChange={(e) => updateField("billingState", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Postal Code *</label>
                    <input
                      required
                      className={inputClass}
                      value={form.billingPostalCode}
                      onChange={(e) => updateField("billingPostalCode", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Country *</label>
                    <select
                      required
                      className={inputClass}
                      value={form.billingCountry}
                      onChange={(e) => updateField("billingCountry", e.target.value)}
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                    </select>
                  </div>
                </div>
              )}
            </section>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cart"
                className="inline-flex flex-1 items-center justify-center rounded-sm border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center rounded-sm bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
              >
                Process
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/shop"
              className="mt-6 inline-flex text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              Back to shop
            </Link>
          </aside>
        </form>
      </div>
    </div>
  );
}
