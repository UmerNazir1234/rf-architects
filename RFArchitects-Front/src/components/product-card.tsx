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
        {/* Product Name on Left, Collection/Category on Right */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 flex-1">
            {name}
          </h3>
          {(collectionName || categoryName) && (
            <div className="text-[10px] uppercase tracking-wide text-gray-500 text-right whitespace-nowrap">
              {collectionName && <div>{collectionName}</div>}
              {categoryName && <div>{categoryName}</div>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600">Rs. {typeof price === 'number' ? price.toLocaleString() : price}</p>
          {resolvedCompareAtPrice !== null && resolvedCompareAtPrice > 0 && (
            <p className="text-sm text-gray-400 line-through">Rs. {resolvedCompareAtPrice.toLocaleString()}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
