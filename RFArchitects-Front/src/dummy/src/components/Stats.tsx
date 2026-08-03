"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const metrics = [
  {
    value: 2025,
    title: "Year of establishment",
    note: "More than 10 years in the field",
    avatars: [
      "/team-portrait-1.jpg",
      "/team-portrait-2.jpg",
      "/team-portrait-3.jpg",
    ],
  },
  {
    value: 304,
    title: "Projects are launched",
    note: "A lot of projects are done",
    avatars: [
      "/project-thumb-1.jpg",
      "/project-thumb-2.jpg",
      "/project-thumb-3.jpg",
    ],
  },
  {
    value: 189,
    title: "Clients are satisfied",
    note: "These people love us",
    avatars: [
      "/client-portrait-1.png",
      "/client-portrait-2.jpg",
      "/client-portrait-3.jpg",
    ],
  },
  {
    value: 12,
    title: "Projects in work",
    note: "What we do right now",
    avatars: [
      "/work-in-progress-1.jpg",
      "/work-in-progress-2.jpg",
      "/work-in-progress-3.jpg",
    ],
  },
];

const Stats = () => {
  const [shownBlocks, setShownBlocks] = useState<boolean[]>(
    metrics.map(() => false)
  );
  const [values, setValues] = useState<number[]>(metrics.map(() => 0));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  // 👀 Trigger count-up when block enters view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    refs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setShownBlocks((prev) => {
                const copy = [...prev];
                copy[i] = true;
                return copy;
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ⏫ Count up numbers
  useEffect(() => {
    metrics.forEach((metric, i) => {
      if (!shownBlocks[i]) return;
      const duration = 1400;
      const start = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(metric.value * eased);
        setValues((prev) => {
          const copy = [...prev];
          copy[i] = val;
          return copy;
        });
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    });
  }, [shownBlocks]);

  return (
    <section className="relative bg-[#F1F1F1] mx-auto px-6 md:px-8 py-16 md:py-24" id="about-us">
      <div className="  ">
        {/* Header (Year on left - Text on right) */}
        <div className="mb-40 flex flex-col justify-center items-center  md:flex-row md:items-start gap-8">
          <div className="text-[14px] font-medium text-neutral-500 md:mt-1 ">
            2025
          </div>
          <h2 className="text-[22px] leading-[1.3] font-medium tracking-tight md:text-[28px] ">
            Whether it’s your home, office, or an entire commercial project, RF Architects is dedicated to shaping your vision into a space that inspires.



            <br className="hidden md:block" />
            From concept to completion, we focus on creating environments that balance beauty, functionality, and timeless design.
            <br className="hidden md:block" />
            <span className="font-semibold">
              And while our work speaks for itself, the numbers speak even louder.
            </span>
          </h2>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-y-14 justify-center md:grid-cols-2 lg:grid-cols-4 lg:gap-x-14 lg:gap-y-0">
          {metrics.map((metric, i) => (
            <div
              key={i}
              ref={(el) => (refs.current[i] = el)}
              className={cn(
                "motion-safe:transition-all motion-safe:duration-700",
                shownBlocks[i]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
                i % 2 === 0 ? "lg:-translate-y-12" : "lg:translate-y-12"
              )}
            >
              <div className="space-y-3">
                <div className="text-[72px] font-semibold leading-[1.1] tracking-tight">
                  {values[i].toLocaleString()}
                </div>
                <div className="text-[18px] md:text-[20px] lg:text-[24px] font-bold ">
                  {metric.title}
                </div>
                <div className="text-[14px] text-neutral-500 !mt-0">
                  {metric.note}
                </div>
                <div className="pt-6 flex items-center">
                  {metric.avatars.map((src, j) => (
                    <img
                      key={j}
                      src={src || "/placeholder.svg"}
                      alt=""
                      className={cn(
                        "h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm",
                        j > 0 && "-ml-4"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-28 flex flex-col justify-center items-center gap-4 md:flex-row gap-8">
          <div className="flex items-center justify-between w-full sm:max-w-[460px] rounded-full bg-white pl-6 pr-2 py-2">
            <span className="text-[15px] font-bold">Want your own Design?</span>
            <button
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
            </button>
          </div>

          <div className="flex items-center gap-2 text-[14px] text-neutral-600">
            <span>Slots are available</span>

            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "#36d399" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
