"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartIcon } from "./CartIcon";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "Projects", href: "/projects" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [mobileMenuOpen]);

    return (
        <div className="w-full relative z-50">
            <div className="border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between px-4 md:px-6 py-4">
                    <div className="flex-shrink-0">
                        <Link href="/" className="block">
                            <img
                                src="/assets/images/black-logo.png"
                                alt="RF Architects"
                                className="h-12 md:h-16 object-contain"
                            />
                        </Link>
                    </div>

                    <div className="flex items-center gap-1 lg:hidden">
                        <CartIcon />
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6 text-gray-800" />
                        </button>
                    </div>

                    <div className="hidden lg:flex items-center gap-6">
                        <nav className="flex items-center gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-gray-600 ${
                                        pathname === item.href
                                            ? "text-gray-900"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <CartIcon />
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-black z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-6">
                    <div className="flex items-center justify-end mb-8">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-md transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block py-4 text-2xl font-semibold text-white hover:text-white/80 transition-colors ${
                                    pathname === item.href ? "text-white" : ""
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Header;
