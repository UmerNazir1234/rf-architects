import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";

export default function ApartmentPremises() {
    return (
        <section className="w-full px-[3vw] py-[6vw] to-black/5" style={{ background: "rgba(0, 0, 0, 1)", position: "relative", zIndex: 1 }}>
            {/* Section Header */}
            <motion.div
                className="text-center mb-[4vw]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
                <motion.h2
                    className="text-[3.5vw] font-light text-white/90 tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                >
                    Explore Our <span className="italic text-[#a9abb5]">Collections</span>
                </motion.h2>
                <motion.div
                    className="w-[8vw] h-[1px] bg-gradient-to-r from-transparent via-[#a9abb5] to-transparent mx-auto mt-[1.5vw]"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                />
            </motion.div>

            {/* Cards Container */}
            <div className="flex gap-[2vw]">
                {/* LEFT COLUMN - Shop */}
                <ServiceCard
                    number="01"
                    lines={[
                        "Discover our curated collection of premium",
                        "furniture pieces designed for modern living",
                    ]}
                    image="/modern-beige-sofa-in-living-room.jpg"
                    h5="Furniture"
                    h3="Shop"
                    ts="Browse our exclusive collection"
                    align="left"
                    link="/shop"
                />

                {/* RIGHT COLUMN - Projects */}
                <ServiceCard
                    number="02"
                    lines={[
                        "Explore our portfolio of completed architectural",
                        "projects and design transformations",
                    ]}
                    image="/project-thumb-2.jpg"
                    h5="Portfolio"
                    h3="Projects"
                    ts="View our latest work"
                    align="right"
                    link="/projects"
                />
            </div>
        </section>
    );
}
