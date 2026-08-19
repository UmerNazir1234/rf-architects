"use client";
import React from 'react'
import Hero from './_components/Hero'
import Stats from './_components/Stats'
import Projects from './_components/Projects';
import Services from './_components/Services';
import ApartmentPremises from './_components/Apartmentpremisses';
import FAQ from './_components/FAQ';
import DiscountMarquee from './_components/DiscountMarquee';
import CallToAction from './_components/CallToAction';
import TestimonialSlider from './_components/Testimonial';
import Advantages from './_components/Advantages';
import FurnitureGallery from './_components/FurnitureGallery';
import SectionLoader from '@/components/SectionLoader';

const page = () => {
    return (
        <div className="min-h-screen">
            <Hero />
            <Stats />
            <ApartmentPremises />
            <Projects />
            <Services />
            <FAQ />
            <DiscountMarquee />
            <CallToAction />
            <TestimonialSlider />
            <Advantages />
            <FurnitureGallery />

        </div>
    )
}

export default page