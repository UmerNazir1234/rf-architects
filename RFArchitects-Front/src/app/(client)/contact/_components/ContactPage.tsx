"use client";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { Site } from "@/lib/site";
import ContactForm from "./ContactForm";

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
            <main className="pt-0">
                {/* Hero Section */}
                <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-black text-white overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/contact-banner.png"
                            alt="Contact Hero"
                            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
                    </div>
                    <div className="relative z-10 container mx-auto px-6 text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wider uppercase mb-6"
                        >
                            Get In Touch
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight"
                        >
                            Let&apos;s Start a <br />{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                Conversation
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
                        >
                            Whether you have a question about our services, pricing, or just
                            want to say hello, we&apos;re here to help.
                        </motion.p>
                    </div>
                </section>

                <section className="py-24 bg-white relative">
                    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-12"
                        >
                            <div>
                                <h2 className="text-4xl font-bold mb-6 text-gray-900 tracking-tight">
                                    Contact Information
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    Ready to bring your vision to life? Reach out to us through
                                    any of the following channels.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {[
                                    {
                                        icon: MapPin,
                                        title: "Visit Us",
                                        content: [
                                            Site.contact.address.split(", ").slice(0, 2).join(", "),
                                            Site.contact.address.split(", ").slice(2).join(", "),
                                        ],
                                    },
                                    {
                                        icon: Phone,
                                        title: "Call Us",
                                        content: [Site.contact.phone],
                                    },
                                    {
                                        icon: Mail,
                                        title: "Email Us",
                                        content: [Site.contact.email],
                                    },
                                    {
                                        icon: Clock,
                                        title: "Working Hours",
                                        content: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"],
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-6 group">
                                        <div className="p-4 bg-gray-50 rounded-2xl text-gray-900 group-hover:bg-black group-hover:text-white transition-colors duration-300 shadow-sm">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {item.title}
                                            </h3>
                                            {item.content.map((line, i) => (
                                                <p key={i} className="text-gray-600 leading-relaxed">
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-gray-50 p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100"
                        >
                            <h2 className="text-3xl font-bold mb-8 text-gray-900">
                                Send Message
                            </h2>
                            <ContactForm />
                        </motion.div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="h-[500px] w-full relative grayscale hover:grayscale-0 transition-all duration-700">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.266206063966!2d73.0792!3d33.5466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDMyJzQ3LjgiTiA3M8KwMDQnNDUuMSJF!5e0!3m2!1sen!2s!4v1635765432109!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        title="Google Maps"
                    ></iframe>
                </section>
            </main>
        </div>
    )
}

export default ContactPage