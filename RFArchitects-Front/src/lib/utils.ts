import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the display price for a product on listing pages
 * - If product has variants with prices, returns the minimum variant price
 * - Otherwise returns the base product price
 */
export function getDisplayPrice(product: any): number {
  if (!product) return 0;

  const directPrice = typeof product.price === 'number' && product.price > 0 ? product.price : null;
  if (directPrice !== null) return directPrice;

  const variantGroups =
    (Array.isArray(product.variantGroups) && product.variantGroups.length > 0 && product.variantGroups)
    || (Array.isArray(product.options) && product.options.length > 0 && product.options)
    || [];

  const variantPrices: number[] = [];

  for (const group of variantGroups) {
    if (group.options && Array.isArray(group.options)) {
      for (const option of group.options) {
        if (typeof option.price === 'number' && option.price > 0) {
          variantPrices.push(option.price);
        }
      }
    }
  }

  if (variantPrices.length > 0) {
    return Math.min(...variantPrices);
  }

  return 0;
}

export function getCompareAtPrice(product: any): number | null {
  if (!product) return null;

  const compareAtPrice = typeof product.compareAtPrice === 'number' && product.compareAtPrice > 0
    ? product.compareAtPrice
    : null;

  if (compareAtPrice !== null) return compareAtPrice;

  const variantGroups =
    (Array.isArray(product.variantGroups) && product.variantGroups.length > 0 && product.variantGroups)
    || (Array.isArray(product.options) && product.options.length > 0 && product.options)
    || [];

  for (const group of variantGroups) {
    if (group.options && Array.isArray(group.options)) {
      for (const option of group.options) {
        if (typeof option.compareAtPrice === 'number' && option.compareAtPrice > 0) {
          return option.compareAtPrice;
        }
      }
    }
  }

  return null;
}
