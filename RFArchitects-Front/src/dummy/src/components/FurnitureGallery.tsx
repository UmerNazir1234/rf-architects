"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const galleryItems = [
  {
    id: 1,
    label: "Accent Chair",
    category: "chairs",
    image: "/elegant-accent-chair-with-cushions.jpg",
  },
  {
    id: 2,
    label: "Bookshelf",
    category: "storage",
    image: "/elegant-wooden-bookshelf-with-decor.jpg",
  },
  {
    id: 3,
    label: "Dining Set",
    category: "dining",
    image: "/wooden-dining-table.png",
  },
  {
    id: 4,
    label: "Bedroom Suite",
    category: "beds",
    image: "/luxury-bedroom-with-bed-and-nightstands.jpg",
  },
  {
    id: 5,
    label: "Coffee Table",
    category: "living",
    image: "/modern-minimalist-coffee-table.jpg",
  },
  {
    id: 6,
    label: "Decorated Room",
    category: "accessories",
    image: "/beautifully-decorated-living-room-interior.jpg",
  },
  {
    id: 7,
    label: "Office Desk",
    category: "storage",
    image: "/contemporary-home-office-desk-setup.jpg",
  },
  {
    id: 8,
    label: "Modern Sofa",
    category: "living",
    image: "/modern-beige-sofa-in-living-room.jpg",
  },
];

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
          to="/shop"
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
            to={`/collections/${galleryItems[0].category}`}
            className="w-full h-full"
          >
            <motion.div
              key={galleryItems[0].id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden shadow-md bg-gray-100 cursor-pointer w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-full"
            >
              <img
                src={galleryItems[0].image}
                alt={galleryItems[0].label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold tracking-wide text-center drop-shadow-lg">
                  {galleryItems[0].label}
                </h3>
              </div>
            </motion.div>
          </Link>

          {/* Right side — smaller images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:col-span-2 justify-items-center w-full">
            {galleryItems.slice(1, 7).map((item) => (
              <Link
                key={item.id}
                to={`/collections/${item.category}`}
                className="w-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: item.id * 0.05 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden shadow-md bg-gray-100 cursor-pointer 
                             w-full aspect-[1/1] max-w-[280px] sm:max-w-[260px] md:max-w-[280px] lg:max-w-none"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <h3 className="text-white text-sm sm:text-base md:text-lg uppercase font-semibold tracking-wide text-center drop-shadow-lg">
                      {item.label}
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
