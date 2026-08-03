"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Team = () => {
  type Member = {
    name: string;
    role: string;
    img: string;
    alt: string;
  };

  const InView = ({
    children,
    className,
    delay = 0,
  }: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
  }) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const [shown, setShown] = React.useState(false);

    React.useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setShown(true);
              io.disconnect();
            }
          });
        },
        { threshold: 0.15 }
      );
      io.observe(el);
      return () => io.disconnect();
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "motion-safe:transition-all motion-safe:duration-700",
          shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          className
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    );
  };

  const TeamCard = ({
    m,
    large = false,
    className,
  }: {
    m: Member;
    large?: boolean;
    className?: string;
  }) => {
    return (
      <InView
        className={cn(
          "relative overflow-hidden rounded-2xl ring-1 ring-(--color-border)",
          className
        )}
      >
        <img
          src={
            m.img ||
            "/placeholder.svg?height=320&width=480&query=portrait%20headshot%20photography"
          }
          alt={m.alt}
          className={cn(
            "w-full object-cover",
            large ? "h-[420px]" : "h-[220px]"
          )}
          crossOrigin="anonymous"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 text-white drop-shadow">
          <div className="text-sm font-semibold">{m.name}</div>
          <div className="text-xs/5 text-white/80">{m.role}</div>
        </div>
      </InView>
    );
  };

  const StatTile = () => {
    return (
      <InView className="flex items-center justify-center rounded-2xl border border-dashed border-(--color-border) bg-background">
        <div className="text-center py-14">
          <div className="text-4xl font-semibold tracking-tight">50+</div>
          <div className="mt-2 text-xs text-muted-foreground">
            People in business
          </div>
        </div>
      </InView>
    );
  };

  const TEAM_TOP: Member[] = [
    {
      name: "Valeria Novikova",
      role: "Designer",
      img: "/female-designer-portrait.png",
      alt: "Valeria Novikova portrait",
    },
    {
      name: "Alex Podzemsky",
      role: "Designer",
      img: "/male-designer-portrait-bokeh.jpg",
      alt: "Alex Podzemsky portrait",
    },
    {
      name: "Helen Reeves",
      role: "Designer",
      img: "/female-portrait-studio.jpg",
      alt: "Helen Reeves portrait",
    },
  ];

  const OWNER: Member = {
    name: "Mark Jackson",
    role: "Owner",
    img: "/serious-business-owner-portrait-studio.jpg",
    alt: "Owner portrait",
  };

  const BOTTOM_SINGLE: Member = {
    name: "Tanya Rodriguez",
    role: "HR",
    img: "/smiling-woman-headshot.png",
    alt: "HR portrait",
  };

  return (
    <section className="relative bg-[#F1F1F1] mx-auto px-6 md:px-8 py-16 md:py-24">
      <div className="container">
        {/* Header block */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start mb-10">
          <div className="space-y-4">
            <div className="text-[16px] font-extrabold">
               WHO WORK FOR YOU
            </div>
            <p className="max-w-[270px] font-[500] leading-5 text-[16px] text-[#828487]">
              The team which changes the world of interior design
            </p>
          </div>
        </div>

        
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
              mb-4
            ">
              <h2 className="
                text-4xl sm:text-5xl md:text-6xl lg:text-[72px] 
                leading-[1.1] font-bold 
                 whitespace-nowrap
              ">
               The Team:
              </h2>
            </div>
        </div>
         

        {/* Lead + top cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-1 gap-8 items-start">
          <p className="max-w-3xl text-[24px] md:text-[26px] font-extrabold leading-8 md:leading-9 text-foreground/90">
            We are a passionate team of designers dedicated to transforming your
            vision into beautifully crafted spaces.
          </p>

          {/* Top-right three cards — now visible on all screen sizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {TEAM_TOP.map((m, i) => (
              <TeamCard key={i} m={m} />
            ))}
          </div>
        </div>

        {/* Bottom grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 order-1 sm:order-none">
            <TeamCard m={OWNER} large className="h-full" />
          </div>
          <div className="md:col-span-3 order-3 sm:order-none">
            <TeamCard m={BOTTOM_SINGLE} />
          </div>
          <div className="md:col-span-2 order-2 sm:order-none">
            <StatTile />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
