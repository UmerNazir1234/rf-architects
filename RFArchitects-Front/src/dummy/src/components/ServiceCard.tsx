import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

interface ServiceCardProps {
    number: string;
    lines: string[];
    image: string;
    h5: string;
    h3: string;
    ts: string;
    align: "left" | "right";
    link: string;
}

const ServiceCard = ({ number, lines, image, h5, h3, ts, align, link }: ServiceCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for image
    const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);

    // Text reveal animations
    const textVariants = {
        hidden: {
            y: 60,
            opacity: 0,
            filter: "blur(10px)"
        },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
            }
        })
    };

    // Number animation
    const numberVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
            }
        }
    };

    return (
        <motion.div
            ref={cardRef}
            className="w-1/2 relative pb-[8vw] group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            {/* NUMBER with animated circle */}
            <motion.div
                className="flex items-center justify-center gap-[1vw] mt-[2vw]"
                variants={numberVariants}
            >
                <motion.div
                    className="w-[3vw] h-[3vw] rounded-full border border-[#a9abb5]/30 flex items-center justify-center"
                    whileHover={{
                        scale: 1.1,
                        borderColor: "#a9abb5",
                        backgroundColor: "rgba(169, 171, 181, 0.1)"
                    }}
                    transition={{ duration: 0.4 }}
                >
                    <span className="text-[#a9abb5] text-[1.1vw] font-light tracking-wider">
                        {number}
                    </span>
                </motion.div>
            </motion.div>

            {/* DESCRIPTION TEXT with stagger animation */}
            <div className="mt-[4vw] px-[3vw] text-center">
                {lines.map((line, i) => (
                    <motion.div
                        key={i}
                        className="overflow-hidden"
                        variants={textVariants}
                        custom={i}
                    >
                        <div className="text-[#a9abb5] text-[1.05vw] leading-[1.6vw] font-light tracking-wide">
                            {line}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* CLICKABLE IMAGE CONTAINER with sophisticated hover effects */}
            <Link href={link}>
                <motion.div
                    className={`relative mt-[8vw] cursor-pointer ${align === "left"
                        ? "ml-[2vw] mr-auto max-w-[44vw]"
                        : "ml-auto mr-[2vw] max-w-[44vw]"
                        }`}
                    initial={{ opacity: 0, y: 80, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 0.95 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                    whileHover={{ scale: 1 }}
                >
                    <motion.div
                        className="relative w-full h-[56vw] overflow-hidden bg-[#1a1a1a] rounded-[0.5vw]"
                        whileHover="hover"
                        initial="initial"
                    >
                        {/* PARALLAX IMAGE */}
                        <motion.div
                            className="absolute inset-0"
                            style={{ y: imageY }}
                        >
                            <motion.img
                                src={image}
                                className="w-full h-full object-cover"
                                alt={`${h5} ${h3}`}
                                variants={{
                                    initial: { scale: 1 },
                                    hover: { scale: 1.1 }
                                }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                            />
                        </motion.div>

                        {/* DARKER OVERLAY - Increased opacity */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"
                            initial={{ opacity: 0.8 }}
                            variants={{
                                initial: { opacity: 0.8 },
                                hover: { opacity: 0.6 }
                            }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        />

                        {/* CIRCULAR MASK EFFECT */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                                clipPath: "circle(0% at 50% 50%)"
                            }}
                            variants={{
                                initial: { clipPath: "circle(0% at 50% 50%)" },
                                hover: { clipPath: "circle(70% at 50% 50%)" }
                            }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm" />
                        </motion.div>

                        {/* CENTER TEXT CONTENT */}
                        <div className="absolute inset-0 flex items-center justify-center text-center z-10 pointer-events-none">
                            <div className="space-y-[0.5vw]">
                                {/* Subtitle */}
                                <motion.div
                                    className="text-white/95 font-light tracking-[0.3em] uppercase"
                                    variants={{
                                        initial: { opacity: 1, y: 0, scale: 1, fontSize: "1vw" },
                                        hover: {
                                            opacity: 0.95,
                                            y: -5,
                                            scale: 1.05,
                                            fontSize: "1.1vw",
                                            letterSpacing: "0.35em"
                                        }
                                    }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                                >
                                    {h5}
                                </motion.div>

                                {/* Main Title */}
                                <motion.div
                                    className="text-white font-light leading-none tracking-tight"
                                    variants={{
                                        initial: { opacity: 1, y: 0, scale: 1, fontSize: "3.5vw" },
                                        hover: {
                                            opacity: 1,
                                            y: -8,
                                            scale: 1.05,
                                            fontSize: "3.8vw",
                                            textShadow: "0 0 20px rgba(255,255,255,0.2)"
                                        }
                                    }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                                >
                                    {h3}
                                </motion.div>

                                {/* Description */}
                                <motion.div
                                    className="text-white/70 font-light tracking-wider"
                                    variants={{
                                        initial: { opacity: 0.7, y: 0, scale: 1, fontSize: "0.8vw" },
                                        hover: {
                                            opacity: 1,
                                            y: 5,
                                            scale: 1.02,
                                            fontSize: "0.85vw",
                                            color: "#a9abb5"
                                        }
                                    }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                                >
                                    {ts}
                                </motion.div>

                                {/* Animated underline */}
                                <motion.div
                                    className="mx-auto bg-white/50 h-[1px]"
                                    variants={{
                                        initial: { width: 0, opacity: 0 },
                                        hover: { width: "6vw", opacity: 1 }
                                    }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.1 }}
                                />

                                {/* Click to explore text */}
                                <motion.div
                                    className="text-white/50 font-light tracking-widest uppercase mt-[2vw]"
                                    variants={{
                                        initial: { opacity: 0, y: 15, fontSize: "0.65vw" },
                                        hover: { opacity: 1, y: 0, fontSize: "0.7vw" }
                                    }}
                                    transition={{ duration: 0.4, delay: 0.15 }}
                                >
                                    Click to Explore →
                                </motion.div>
                            </div>
                        </div>

                        {/* CORNER ACCENTS */}
                        <motion.div
                            className="absolute top-[2vw] left-[2vw] w-[3vw] h-[3vw] border-l-2 border-t-2 border-white/0"
                            variants={{
                                initial: { opacity: 0, scale: 0.8 },
                                hover: {
                                    opacity: 0.5,
                                    scale: 1,
                                    borderColor: "rgba(255,255,255,0.5)"
                                }
                            }}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.div
                            className="absolute bottom-[2vw] right-[2vw] w-[3vw] h-[3vw] border-r-2 border-b-2 border-white/0"
                            variants={{
                                initial: { opacity: 0, scale: 0.8 },
                                hover: {
                                    opacity: 0.5,
                                    scale: 1,
                                    borderColor: "rgba(255,255,255,0.5)"
                                }
                            }}
                            transition={{ duration: 0.5 }}
                        />

                        {/* Hover scale effect on entire card */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            variants={{
                                initial: { scale: 1 },
                                hover: { scale: 1.02 }
                            }}
                            transition={{ duration: 0.6 }}
                        />
                    </motion.div>
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default ServiceCard;