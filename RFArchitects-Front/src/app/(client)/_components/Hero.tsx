import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => {
        setShowHero(true);
      }, 500);
    }, 50);

    return () => clearTimeout(introTimer);
  }, []);

  return (
    <>
      {/* Fixed Hero Section (background + text) */}
      <section className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black ">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/hero-bg.jpg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        {/* Intro (black screen with logo) */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-1000 ${showIntro ? "opacity-100 z-20" : "opacity-0 z-0 pointer-events-none"
            }`}
        >
          <div className="bg-black px-16 py-12 rounded-3xl animate-scale-in-hero">
            <div className="text-center">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-white">
                RF ARCHITECTS
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-white/80">
                <span>We Craft Interiors</span>
                <span className="text-accent text-2xl">+</span>
                <span>Since 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Text & Elements */}
        <div
          className={`relative z-10 w-full text-center transition-opacity duration-1000 ${showHero ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="container mx-auto px-6 py-32">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Top Badge */}
              {/* <div
                className="inline-flex items-center gap-3 text-sm text-white/90 mb-8 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <span className="font-light">We Craft Interiors</span>
                <span className="text-accent text-2xl">+</span>
                <span className="font-light">Since 2025</span>
              </div> */}

              {/* Awards Badge */}
              <div
                className="absolute top-32 left-8 md:left-24 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg animate-slide-up hidden md:block"
                style={{ animationDelay: "0.6s" }}
              >
                <div className="text-xs text-muted-foreground mb-1">2026</div>
                <div className="font-semibold text-sm">Interior</div>
                <div className="font-semibold text-sm">Design Awards</div>
              </div>

              {/* Main Heading */}
              <h1
                className="text-4xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.95] tracking-tight animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                Where Ideas
                <br />
                Meet Skills
              </h1>

              {/* Bottom Services */}
              <div
                className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-white/80 text-xs md:text-sm pt-8 animate-fade-in"
                style={{ animationDelay: "0.8s" }}
              >
                <span className="font-light">Interior Design</span>
                <span className="font-light">Exterior Design</span>
                <span className="font-light">Tech Specifications</span>
                <span className="hidden md:inline text-white/40">•</span>
                <span className="font-light">Design Project</span>
                <span className="hidden md:inline text-white/40">•</span>
                <span className="font-light">3D visualisation</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            className="absolute bottom-12 right-8 md:right-12 flex items-center gap-3 text-white/80 text-sm group cursor-pointer animate-fade-in"
            style={{ animationDelay: "1s" }}
          >
            <span className="font-light transition-transform group-hover:translate-x-1">
              Scroll
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </section>

      {/* Spacer (to allow scroll) */}
      <div className="h-screen w-full bg-transparent"></div>
    </>
  );
};

export default Hero;

// https://RF ARCHITECTS.framer.website/
