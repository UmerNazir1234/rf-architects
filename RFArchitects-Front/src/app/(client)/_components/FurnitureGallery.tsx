"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { collections } from "@/lib/collections";

const FurnitureGallery = () => {
  return (
    <section className="relative bg-[#F1F1F1] mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24">
      {/* Divider line */}
      <div className="border-t-4 border-black -mt-16 sm:-mt-24 mb-8"></div>

      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-4 leading-tight">
          Our Marketplace
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-sm md:text-base">
          Discover our curated collection of premium furniture and accessories.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 bg-black text-white text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors rounded-sm"
        >
          SHOP ALL
        </Link>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 place-items-center">
          {/* Left side — one large image */}
          <Link
            href={`/collections/${collections[0].slug}`}
            className="w-full h-full"
          >
            <motion.div
              key={collections[0].slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden shadow-md bg-gray-100 cursor-pointer w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-full"
            >
              <img
                src={collections[0].image}
                alt={collections[0].name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold tracking-wide text-center drop-shadow-lg">
                  {collections[0].name}
                </h3>
              </div>
            </motion.div>
          </Link>

          {/* Right side — smaller images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:col-span-2 justify-items-center w-full">
            {collections.slice(1, 7).map((item, index) => (
              <Link
                key={item.slug}
                href={`/collections/${item.slug}`}
                className="w-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden shadow-md bg-gray-100 cursor-pointer 
                             w-full aspect-[1/1] max-w-[280px] sm:max-w-[260px] md:max-w-[280px] lg:max-w-none"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <h3 className="text-white text-sm sm:text-base md:text-lg uppercase font-semibold tracking-wide text-center drop-shadow-lg">
                      {item.name}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FurnitureGallery;
