"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
  subtext: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed Khan",
    role: "House Owner – Lahore",
    image: `/assets/avatar.png`,
    quote:
      "“The team understood exactly what my family needed. The transformation was beyond our expectations — modern, practical, and truly elegant.”",
    subtext:
      "Ahmed wanted a clean, contemporary home design. We created a bright layout with soft textures, improved lighting, and a functional interior for his family.",
  },
  {
    id: 2,
    name: "Zainab Fatima",
    role: "Office Manager – Karachi",
    image: `/assets/avatar.png`,
    quote:
      "“Their professionalism and attention to detail were outstanding. Our office now feels more organized, spacious, and aligned with our brand identity.”",
    subtext:
      "Zainab needed a refreshing office space. We redesigned the layout with ergonomic furniture, acoustic balance, and a modern aesthetic for better productivity.",
  },
  {
    id: 3,
    name: "Hassan Ali",
    role: "Restaurant Owner – Islamabad",
    image: `/assets/avatar.png`,
    quote:
      "“They delivered a design that instantly elevated the look and feel of my restaurant. Customers love the ambiance — it has boosted our business.”",
    subtext:
      "Hassan required an inviting restaurant interior. We crafted a warm ambiance with premium materials, custom lighting, and a cohesive theme.",
  },
  {
    id: 4,
    name: "Maria Shah",
    role: "Villa Owner – Bahria Town",
    image: `/assets/avatar.png`,
    quote:
      "“From the first meeting to the final handover, everything was handled smoothly. My villa now feels luxurious, calm, and perfectly styled.”",
    subtext:
      "Maria wanted a luxurious yet minimal home. We created a balanced design with neutral tones, curated décor, and a serene, high-end feel.",
  },
  {
    id: 5,
    name: "Bilal Siddiqui",
    role: "Commercial Property Developer – Multan",
    image: `/assets/avatar.png`,
    quote:
      "“Their expertise brought tremendous value to our commercial project. The space is now modern, functional, and visually striking.”",
    subtext:
      "Bilal needed a strong visual identity for his commercial building. We delivered a modern exterior concept with clean lines and a cohesive architectural language.",
  },
];


export default function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const current = TESTIMONIALS[index];

  const next = () =>
    setIndex((i) => (i + 1 >= TESTIMONIALS.length ? 0 : i + 1));
  const prev = () =>
    setIndex((i) => (i - 1 < 0 ? TESTIMONIALS.length - 1 : i - 1));

  return (
    <section className="relative bg-white mx-auto px-6 md:px-8 py-16 md:py-24">
      <div className=" ">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start mb-16">
          <div className="space-y-4">
            <div className="text-[16px] font-extrabold">OWR CLIENTS SAY</div>
            <p className="max-w-[270px] font-[500] leading-5 text-[16px] text-[#828487]">
              The warm words of our clients let us achieve more
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-start">
          {/* Left Column */}
          <div className="space-y-4 col-span-2">
            <div className="flex flex-col gap-3 mt-2">
              <img
                src={current.image}
                alt={current.name}
                className="h-[96px] w-[96px] rounded-full object-cover"
              />
              <div>
                <div className="text-lg font-medium text-black">
                  {current.name}
                </div>
                <div className="text-sm font-[500] text-[#828487]">
                  {current.role}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <blockquote className="text-[22px] md:text-[42px] font-semibold leading-tight text-black">
                  {current.quote}
                </blockquote>
                <p className="mt-4 text-[22px] md:text-[24px] font-[600] max-w-[700px] text-[#828487] leading-8">
                  {current.subtext}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex gap-3">
              <button
                onClick={prev}
                className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-full border border-black/20 text-black",
                  "hover:bg-black hover:text-white transition-colors duration-200"
                )}
                aria-label="Previous testimonial"
              >
                ←
              </button>
              <button
                onClick={next}
                className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-full border border-black/20 text-black",
                  "hover:bg-black hover:text-white transition-colors duration-200"
                )}
                aria-label="Next testimonial"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
