"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProductCard({
  id,
  slug,
  name,
  price,
  image,
  details,
  collectionName,
  categoryName,
  compareAtPrice,
  onWishlist = false,
}: any) {
  const [isWishlisted, setIsWishlisted] = useState(onWishlist);
  const resolvedImage = typeof image === "string" ? image : image?.url || "/placeholder.svg";
  const productLink = `/products/${slug || id}`;
  const resolvedCompareAtPrice = typeof compareAtPrice === 'number' && compareAtPrice > 0 ? compareAtPrice : null;

  return (
    <Link href={productLink}>
      <div className="group cursor-pointer">
        <div className="relative bg-gray-100 aspect-square overflow-hidden rounded-sm mb-3">
          <img
            src={resolvedImage}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {/* Wishlist button removed  */}
        </div>
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
          {name}
        </h3>
        <div className="mb-1 flex items-center gap-2">
          <p className="text-sm text-gray-600">Rs. {typeof price === 'number' ? price.toLocaleString() : price}</p>
          {resolvedCompareAtPrice !== null && resolvedCompareAtPrice > 0 && (
            <p className="text-sm text-gray-400 line-through">Rs. {resolvedCompareAtPrice.toLocaleString()}</p>
          )}
        </div>
        {(collectionName || categoryName) && (
          <div className="mb-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-gray-500">
            {collectionName && <span className="rounded-full bg-gray-100 px-2 py-1">{collectionName}</span>}
            {categoryName && <span className="rounded-full bg-gray-100 px-2 py-1">{categoryName}</span>}
          </div>
        )}
        {details && <p className="text-xs text-gray-500">{details}</p>}
      </div>
    </Link>
  );
}
