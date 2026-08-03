"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import darkBg from "@/assets/dark-section-bg.jpg";

type Step = {
  step: string;
  title: string;
  desc: string;
  img: string;
  alt: string;
};

const STEPS: Step[] = [
  {
    step: "→ 01",
    title: "Consultation & Site Analysis",
    desc: "Comprehensive site measurement and architectural assessment of both interior and exterior spaces.",
    img: "/work-in-progress-1.jpg",
    alt: "Architectural site analysis",
  },
  {
    step: "→ 02",
    title: "Concept & Schematic Design",
    desc: "Hand-drawn sketches outlining the architectural style and spatial layout for interior and exterior spaces.",
    img: "/project-thumb-1.jpg",
    alt: "Architectural concept sketches",
  },
  {
    step: "→ 03",
    title: "Design Development",
    desc: "Detailed technical layouts, material specifications, and architectural drawings for both interior and exterior.",
    img: "/work-in-progress-2.jpg",
    alt: "Architectural design development",
  },
  {
    step: "→ 04",
    title: "3D Visualization",
    desc: "Photorealistic renderings allowing clients to experience both interior spaces and exterior architecture.",
    img: "/project-thumb-2.jpg",
    alt: "Architectural 3D visualization",
  },
  {
    step: "→ 05",
    title: "Project Estimation",
    desc: "Detailed pricing and cost breakdown for the complete architectural project.",
    img: "/work-in-progress-3.jpg",
    alt: "Architectural project estimation",
  },
  {
    step: "→ 06",
    title: "Material Selection",
    desc: "Curated selection of building materials, finishes, and fixtures for interior and exterior elements.",
    img: "/project-thumb-3.jpg",
    alt: "Architectural materials selection",
  },
  {
    step: "→ 07",
    title: "Construction Supervision",
    desc: "Architectural oversight ensuring both interior and exterior execution matches design intent.",
    img: "/team-portrait-2.jpg",
    alt: "Architectural construction supervision",
  },
];
function useParallax(ref: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height + vh;
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / total));
        el.style.setProperty("--p", progress.toFixed(4));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
}

const Process = () => {
  const ref = React.useRef<HTMLElement>(null);
  useParallax(ref);

  return (
    <section
      ref={ref}
      className="relative isolate bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${darkBg})` }}
      id="our-process"
    >
      {/* overlay tint */}
      <div className="absolute inset-0 bg-[#121212]/95" />

      {/* parallax stripes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          transform: "translateY(calc(var(--p,0) * -60px))",
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--process-stripe) 0 1px, transparent 1px 48px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          transform: "translateY(calc(var(--p,0) * -120px))",
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--process-stripe) 0 1px, transparent 1px 24px)",
        }}
      />

      {/* vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0) 15%, rgba(0,0,0,0) 85%, rgba(0,0,0,0.35))",
        }}
      />

      {/* content */}
      <div className="relative   text-white mx-auto px-6 md:px-8 py-16 md:py-24">
        {/* Heading */}

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start mb-10">
          <div className="space-y-4">
            <div className="text-[16px] font-extrabold">HOW WE DO IT</div>
            <p className="max-w-[300px] font-[500] leading-5 text-[16px] text-[#828487]">
              Our process transforms your vision into a built reality, balancing creative exploration with architectural precision.
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div
          className="
  grid grid-cols-1 
  sm:grid-cols-2 
  md:grid-cols-2 
  lg:grid-cols-4 
  gap-10
"
        >
          {/* Row 1: Title (standalone on md and sm, centered on lg) */}
          <div
            className="
    col-span-1 
    sm:col-span-2 
    md:col-span-2 
    lg:col-span-3 
    flex justify-start lg:justify-center text-center
  "
          >
            <h2
              className="
      text-4xl sm:text-5xl md:text-6xl lg:text-[72px] 
      leading-[1.1] font-bold text-white 
      text-balance whitespace-nowrap mb-4
    "
            >
              The Process: *
            </h2>
          </div>

          {STEPS.map((s, i) => (
            <article
              key={i}
              className={cn(
                "space-y-4 max-w-[350px] w-full mx-auto",

                // 👉 Zig-zag for lg only
                i === 0 && "lg:col-start-4 lg:row-start-1",
                i === 1 && "lg:col-start-1 lg:row-start-2",
                i === 2 && "lg:col-start-2 lg:row-start-2",
                i === 3 && "lg:col-start-3 lg:row-start-2",
                i === 4 && "lg:col-start-4 lg:row-start-2",
                i === 5 && "lg:col-start-3 lg:row-start-3",
                i === 6 && "lg:col-start-4 lg:row-start-3"
              )}
            >
              <div className="text-xs tracking-widest text-white/60 uppercase font-medium">
                {s.step}
              </div>
              <div className="rounded-md ring-1 ring-white/10 overflow-hidden">
                <img
                  src={s.img || "/placeholder.svg"}
                  alt={s.alt}
                  className="aspect-[9/3] w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-white leading-tight">
                {s.title}
              </h3>
              <p className="text-base leading-relaxed text-white/70">
                {s.desc}
              </p>

              {i === 5 && (
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span
                    className="inline-block size-2 rounded-full color-black bg-white rounded-fulln"
                    style={{ backgroundColor: "var(--color-brand)" }}
                    aria-hidden
                  />
                  Depends on your wishes
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
