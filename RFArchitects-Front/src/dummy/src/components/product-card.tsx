"use client";

import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({
  id,
  name,
  price,
  image,
  details,
  onWishlist = false,
}) {
  const [isWishlisted, setIsWishlisted] = useState(onWishlist);

  return (
    <Link to={`/products/${id}`}>
      <div className="group cursor-pointer">
        <div className="relative bg-gray-100 aspect-square overflow-hidden rounded-sm mb-3">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {/* Wishlist button removed */}
        </div>
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mb-1">Rs. {typeof price === 'number' ? price.toLocaleString() : price}</p>
        {details && <p className="text-xs text-gray-500">{details}</p>}
      </div>
    </Link>
  );
}
