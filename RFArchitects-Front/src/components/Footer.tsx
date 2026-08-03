"use client";
import { motion, Transition } from "framer-motion";
import Link from "next/link";
import { Site } from "@/lib/site";

const Footer = () => {

  const navItems = [
    { label: "Home", url: "/" },
    { label: "Shop", url: "/shop" },
    { label: "Collections", url: "/collections" },
    { label: "Projects", url: "/projects" },
    { label: "About Us", url: "/about" },

    { label: "Contact", url: "/contact" },
  ];
  const fade: {
    initial: { opacity: number; y: number };
    whileInView: { opacity: number; y: number };
    viewport: { once: boolean; amount: number };
    transition: Transition;
  } = {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <footer
      className="relative bg-black text-white bg-fixed bg-center bg-cover overflow-hidden py-16 md:pt-24 md:pb-4"
      style={{ backgroundImage: `url('/assets/dark-section-bg.jpg')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/85" />

      <div className="relative z-10 container  mx-auto px-6 md:px-8">

        {/* Logo */}
        <motion.h1
          {...fade}
          className="text-[2.5rem] md:text-[2.8rem] font-bold mb-12 tracking-tight uppercase"
        >
          <Link href="/">
            <img src={"/assets/images/white-logo.png"} alt={`${Site.name} Logo`} className="object-contain object-center" width={280} />
          </Link>
        </motion.h1>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {/* Left Tagline */}
          <motion.div {...fade} className="max-w-[310px]">
            <h3 className="text-base md:text-lg leading-snug font-medium">
              {Site.description}
            </h3>
          </motion.div>

          {/* Center Nav */}
          <motion.div
            {...fade}
            transition={{ ...fade.transition, delay: 0.15 }}
            className="flex flex-col items-center"
          >
            <nav className="flex flex-col items-center gap-3 mb-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  {item.url.startsWith("/") ? (
                    <Link
                      href={item.url}
                      className="text-[1.6rem] md:text-[1.8rem] font-semibold hover:text-gray-300 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.url}
                      className="text-[1.6rem] md:text-[1.8rem] font-semibold hover:text-gray-300 transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className="text-center">
              <a href={`tel:${Site.contact.phone}`} className="text-xs block text-white/60 mb-1">{Site.contact.phone}</a>

              <a
                href={`mailto:${Site.contact.email}`}
                className="text-[1.4rem] md:text-[2.4rem] font-bold hover:text-gray-300 transition-colors"
              >
                {Site.contact.email}
              </a>
            </div>
          </motion.div>

          {/* Right Social */}
          <motion.div
            {...fade}
            transition={{ ...fade.transition, delay: 0.3 }}
            className="flex justify-start md:justify-end items-start gap-6"
          >
            {Object.entries(Site.social).map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white transition-colors capitalize"
              >
                {name}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          {...fade}
          transition={{ ...fade.transition, delay: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-white/20"
        >
          <div className="flex flex-wrap gap-4 text-xs text-white/60">
            <span>
              <a className="font-bold" href={Site.copyright.link} target="_blank" rel="noopener noreferrer">
                © {Site.copyright.name}
              </a> — All Rights Reserved
            </span>
          </div>
          {/* Address */}
          <motion.div
            {...fade}
            transition={{ ...fade.transition, delay: 0.45 }}
            className="text-center mb-12"
          >
            <p className="text-sm md:text-base text-white/80">{Site.contact.location}</p>
            <p className="text-sm md:text-base text-white/80">
              {Site.contact.address}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
