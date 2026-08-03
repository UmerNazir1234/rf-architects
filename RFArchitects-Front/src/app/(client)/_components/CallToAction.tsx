"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";


const CallToAction: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div
      ref={ref}
      className="relative w-full  overflow-hidden bg-black flex flex-col justify-between"
    >
      {/* Background Image with Overlay */}
      <motion.div
        style={{
          y,
          backgroundImage:
            `url('/assets/images/banner.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5,
        }}
        className="absolute inset-0 scale-110 will-change-transform"
      >
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col gap-8 h-full justify-end px-6 md:px-16 py-10 md:py-20">
        {/* Top tagline */}

        <div className="
            grid grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-2 
            lg:grid-cols-4 
            gap-10
          ">

          {/* Row 1: Title (standalone on md and sm, centered on lg) */}
          <div className="
              col-span-1 
              sm:col-span-2 
              md:col-span-2 
              lg:col-span-3 
              flex justify-start lg:justify-center text-center
              
            ">
            <div className="text-start">
              <p className="text-white text-[13px] md:text-[16px]">
                Creating Atmospheres
              </p>
              <p className="text-[#F1DFC2] text-[13px] md:text-[16px]">
                That Resonate
              </p>
            </div>
          </div>
        </div>

        {/* Headline + CTA */}
        <div className=" ">
          <div>
            <h1 className="text-white text-[1.5rem] md:text-[120px] font-bold leading-[1.05] tracking-tight">
              It’s so Easy to
            </h1>
            <div className="flex gap-10 justify-end text-white text-[1.5rem] md:text-[120px] font-bold leading-[1.05] tracking-tight">

              <h1>Change</h1>
              <h1>the Mood</h1>

            </div>


            <div className="mt-10 flex justify-center items-center gap-3">
              <button className="w-[300px]  justify-between flex items-center gap-3 pr-2 pl-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full">

                <span className="text-[15px] font-bold text-white">
                  Order the Design
                </span>
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FFDC3A] hover:scale-105 transition"
                  aria-label="Start a project"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
