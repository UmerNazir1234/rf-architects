"use client";

export interface CartItem {
  id: string;
  cartItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  collection?: string;
  category?: string;
  variant?: Record<string, string>;
}

const CART_STORAGE_KEY = "rf-architects-cart";
export const CART_UPDATED_EVENT = "rf-cart-updated";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function getCartItemCount(): number {
  return readCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartItems(): CartItem[] {
  return readCart();
}

export function addToCart(item: CartItem) {
  const cart = readCart();
  const cartItemId = item.cartItemId || `${item.id}::${JSON.stringify(item.variant || {})}`;
  const existing = cart.find((entry) => entry.cartItemId === cartItemId);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({ ...item, cartItemId });
  }

  writeCart(cart);
  return cart;
}

export function updateCartItemQuantity(id: string, quantity: number) {
  const cart = readCart()
    .map((item) => (item.cartItemId === id ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  writeCart(cart);
  return cart;
}

export function removeCartItem(id: string) {
  const cart = readCart().filter((item) => item.cartItemId !== id);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart([]);
  return [];
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
