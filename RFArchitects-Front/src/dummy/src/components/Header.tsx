import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import office from "@/assets/ofc.jpg";
import team1 from "../../public/beautifully-decorated-living-room-interior.jpg"
import team2 from '../../public/ceramic-top-dining-table.jpg'
import team3 from '../../public/concrete-modern-dining-table.jpg'
import team4 from '../../public/elegant-wooden-bookshelf-with-decor.jpg'
import team5 from '../../public/glass-top-dining-table.jpg'
import logo from "@/assets/images/white-logo.png";
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // ✅ Prevent page scroll when drawer open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  // ✅ Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Smooth open/close animation
  const menuVariants: Variants = {
    closed: {
      transform: "translateY(-100%)",
      transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] },
    },
    open: {
      transform: "translateY(0%)",
      transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] },
    },
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "Projects", href: "/projects" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const social = [
    { name: "TikTok", url: "https://www.tiktok.com/@rf.architects01" },
    { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61584466611104" }, // Add your Behance URL when available
    { name: "Instagram", url: "https://www.instagram.com/rfarc_hitects?igsh=MXB0NDBqdnVwZDc0Yg==" }
  ];
  const team = [team1, team2, team3, team4, team5];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/90 backdrop-blur-sm " : "bg-transparent py-2"
        }`}
    >
      {/* Top Navbar */}
      <div className="w-full mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
        {/* ✅ Logo with slight zoom when menu opens */}
        <motion.div
          animate={{ scale: menuOpen ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-xl sm:text-2xl font-bold tracking-tight text-white z-[60]"
        >
          {logo ? <Link to="/"> <img src={logo} alt="RF Architects Logo" className="object-contain object-center max-sm:w-[150px]" width={280} /> </Link> : ' RF ARCHITECTS'}

        </motion.div>

        {/* ✅ Menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-[60] inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="h-7 w-7 sm:h-8 sm:w-8" /> // bigger cross
          ) : (
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </button>
      </div>

      {/* ✅ Fullscreen Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 right-0 h-screen bg-black text-white z-50 overflow-hidden"
          >
            {/* ✅ Scrollable content (drawer only) */}
            <div className="h-full overflow-y-auto no-scrollbar">
              <div className="container mt-24 mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full py-16 lg:py-20">
                {/* LEFT SIDE - Image + Address */}
                <div className="max-w-[470px] flex flex-col gap-6">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={office}
                      alt="Office"
                      className="object-cover w-full h-[220px] sm:h-[260px] lg:h-[300px]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[12px] sm:text-[13px] text-white/80 pt-2 space-y-4 sm:space-y-0">
                    <div>
                      <p className="font-semibold text-white">
                        3rd floor Taha Mall, Defence Rd,
                      </p>
                      {/* <p>Some additional Address</p>  */}
                      <p>Rawalpindi, Punjab 47300</p>
                    </div>
                    <div className="text-left sm:text-right ">
                      <a
                        href="mailto:rfarchitects@gmail.com"
                        className="block font-semibold text-white hover:text-accent transition-colors"
                      >
                        rfarchitects@gmail.com
                      </a>
                      <a
                        href="tel:099791-00-75"
                        className="block hover:text-accent transition-colors"
                      >
                        +92 334 4738506
                      </a>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE - Same Row Layout */}
                <div className="flex justify-between gap-8 flex-col sm:flex-row lg:flex-row">
                  {/* MIDDLE - Nav + Socials */}
                  <div className="flex flex-col   items-start space-y-2">
                    <nav className="space-y-2">
                      {navItems.map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        >
                          {item.href.startsWith("/") ? (
                            <Link
                              to={item.href}
                              className="block text-[1.9rem] sm:text-[2.2rem] lg:text-[2.5rem] font-semibold hover:text-accent transition-colors"
                              onClick={() => setMenuOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <a
                              href={item.href}
                              className="block text-[1.9rem] sm:text-[2.2rem] lg:text-[2.5rem] font-semibold hover:text-accent transition-colors"
                              onClick={() => setMenuOpen(false)}
                            >
                              {item.label}
                            </a>
                          )}
                        </motion.div>
                      ))}
                    </nav>

                    <div className="space-y-3 sm:space-y-4 text-[0.85rem] sm:text-[0.9rem] pt-6">
                      {social.map((s) => (
                        <a
                          key={s.name}
                          href={s.url}
                          className="block text-[#828487] hover:text-accent transition-colors"
                        >
                          {s.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* ✅ RIGHT - Team Images stay on the right side */}
                  <div className="flex flex-col justify-start">
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {team.map((img, i) => (
                        <div
                          key={i}
                          className="aspect-square overflow-hidden rounded-md bg-white/10 hover:scale-105 transition-transform duration-300"
                        >
                          <img
                            src={img}
                            alt={`Team ${i + 1}`}
                            className="object-cover w-[55px] sm:w-[60px] lg:w-[68px]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
