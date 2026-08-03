"use client";
import { useState } from "react";
import { ChevronDown, Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { collections } from "@/lib/collections";


export default function Navigation() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenCategory, setMobileOpenCategory] = useState<string | null>(null);
  const pathname = usePathname();

  const navigationGroups = [
    {
      name: "FURNITURE",
      collections: ["Coffee Tables", "Side Tables", "Nesting Tables", "Night Stands"]
    },
    {
      name: "LIGHTING",
      collections: ["Pendants", "Pendant Chandeliers", "Floor Lamps", "Table Lamps"]
    },
    {
      name: "DECOR",
      collections: ["Candle Stands", "Book Holders", "Decorative Trays"]
    },
    {
      name: "BATHROOM",
      collections: ["Vessel Sinks", "Towel Holders", "Towel Stands"]
    }
  ];

  const getCollectionByTitle = (title: string) => {
    return collections.find(c => c.name === title);
  };

  const toggleMobileCategory = (category: string) => {
    setMobileOpenCategory(mobileOpenCategory === category ? null : category);
  };

  return (
    <div className="w-full relative z-50">
      {/* Header with Logo and Navigation on Same Line */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">


          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <img
                src="/assets/images/black-logo.png"
                alt="RF Architects"
                className="h-12 md:h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden text-xl md:text-2xl font-bold uppercase">
                <img src={"/assets/images/black-logo.png"} alt="RF Architects" className="h-16 md:h-16 object-contain" />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>

          {/* Desktop Navigation - Same Line as Logo */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/shop"
              className={`px-3 xl:px-4 py-3 text-xs xl:text-sm font-medium transition-colors whitespace-nowrap ${pathname === "/shop" ? "text-black border-b-2 border-black" : "text-gray-800 hover:text-gray-600"}`}
            >
              SHOP ALL
            </Link>
            {navigationGroups.map((group) => (
              <div key={group.name} className="relative group">
                <button
                  onMouseEnter={() => setOpenDropdown(group.name)}
                  className="px-3 xl:px-4 py-3 text-xs xl:text-sm font-medium text-gray-800 hover:text-gray-600 flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  {group.name}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                <div
                  onMouseLeave={() => setOpenDropdown(null)}
                  className={`absolute left-0 top-full bg-white border border-gray-200 shadow-lg min-w-[220px] z-50 transition-all duration-200 ${openDropdown === group.name
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                    }`}
                >
                  {group.collections.map((collTitle) => {
                    const coll = getCollectionByTitle(collTitle);
                    if (!coll) return null;
                    return (
                      <Link
                        key={coll.slug}
                        href={`/collections/${coll.slug}`}
                        onClick={() => setOpenDropdown(null)}
                        className="block w-full text-left px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap transition-colors"
                      >
                        {coll.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            <Link
              href="/collections"
              className={`px-3 xl:px-4 py-3 text-xs xl:text-sm font-medium transition-colors whitespace-nowrap ${pathname === "/collections" ? "text-black border-b-2 border-black" : "text-gray-800 hover:text-gray-600"}`}
            >
              COLLECTIONS
            </Link>
          </nav>

          {/* Right Side - Empty for balance on desktop */}
          <div className="hidden lg:block flex-shrink-0 w-16"></div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800">MENU</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          <nav className="space-y-2">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-4 text-left text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors border-b border-gray-100"
            >
              SHOP ALL
            </Link>
            {navigationGroups.map((group) => (
              <div key={group.name} className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => toggleMobileCategory(group.name)}
                  className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
                >
                  {group.name}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${mobileOpenCategory === group.name ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {mobileOpenCategory === group.name && (
                  <div className="pl-4 pb-2 space-y-2">
                    {group.collections.map((collTitle) => {
                      const coll = getCollectionByTitle(collTitle);
                      if (!coll) return null;
                      return (
                        <Link
                          key={coll.slug}
                          href={`/collections/${coll.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block w-full text-left py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {coll.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-4 text-left text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors border-t border-gray-100"
            >
              COLLECTIONS
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
