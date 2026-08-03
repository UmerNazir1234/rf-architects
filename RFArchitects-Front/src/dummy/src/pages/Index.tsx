
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import FAQ from "@/components/FAQ";
import DiscountMarquee from "@/components/DiscountMarquee";
import CallToAction from "@/components/CallToAction";
import Testimonial from "@/components/Testimonial";
import Advantages from "@/components/Advantages";
import WeAre from "@/components/FurnitureGallery";

import VideoSection from "@/components/VideoSection";
import Apartmentpremisses from "@/components/Apartmentpremisses";

const Index = () => {
  return (
    <div className="min-h-screen">

      <Hero />
      <Stats />
      <Apartmentpremisses />
      <Projects />
      <Process />
      {/* <Team /> */}
      <FAQ />
      <DiscountMarquee />
      <CallToAction />
      <Testimonial />
      <Advantages />

      <WeAre />
      {/* <VideoSection /> */}

    </div>
  );
};

export default Index;
