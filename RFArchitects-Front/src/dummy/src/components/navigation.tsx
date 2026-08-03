
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "@/assets/images/black-logo.png";

interface NavigationProps {
  onCategorySelect: (category: string) => void;
}

export default function Navigation({ onCategorySelect }: NavigationProps) {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenCategory, setMobileOpenCategory] = useState<string | null>(null);

  const mainCategories = [
    "LIVING",
    "DINING",
    "BEDROOM",
    "STORAGE & CONSOLES",
    "OUTDOOR",
    "ACCESSORIES",
  ];

  const subcategories: Record<string, string[]> = {
    LIVING: ["Coffee Tables", "Side Tables", "Sofas"],
    DINING: ["Dining Tables", "Dining Chairs"],
    BEDROOM: ["Beds", "Nightstands"],
    ACCESSORIES: ["Lamps", "Decor"],
  };

  const handleCategoryClick = (category: string) => {
    const categoryMap: Record<string, string> = {
      "Coffee Tables": "cofeeTables",
      "Side Tables": "sideTables",
      "Dining Tables": "dining",
      "Dining Chairs": "chairs",
      "Beds": "beds",
      "Nightstands": "nightstands",
      "Lamps": "lamps",
      "Sofas": "sofas",
      "Decor": "decor",
    };
    const mapped = categoryMap[category] || category.toLowerCase().replace(/\s+/g, '');
    onCategorySelect(mapped);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    setMobileOpenCategory(null);
  };

  const toggleMobileCategory = (category: string) => {
    setMobileOpenCategory(mobileOpenCategory === category ? null : category);
  };

  return (
    <div className="w-full relative z-50">
      {/* Header with Logo and Navigation on Same Line */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
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

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <img
                src="/black-logo.png"
                alt="RF Architects"
                className="h-12 md:h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden text-xl md:text-2xl font-bold uppercase">{logo ? <>
                <img src={logo} alt="RF Architects" className="h-16 md:h-16 object-contain" />
              </> : 'RF ARCHITECTS'}</span>
            </Link>
          </div>

          {/* Desktop Navigation - Same Line as Logo */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainCategories.map((category) => (
              <div key={category} className="relative group">
                <button
                  onMouseEnter={() => setOpenDropdown(category)}
                  onClick={() => {
                    if (!subcategories[category]) {
                      // Navigate to collection page for categories without subcategories
                      navigate(`/collections/${category.toLowerCase().replace(/\s+&\s+/g, '')}`);
                    }
                  }}
                  className="px-3 xl:px-4 py-3 text-xs xl:text-sm font-medium text-gray-800 hover:text-gray-600 flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  {category}
                  {subcategories[category] && <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Dropdown Menu */}
                {subcategories[category] && (
                  <div
                    onMouseLeave={() => setOpenDropdown(null)}
                    className={`absolute left-0 top-full bg-white border border-gray-200 shadow-lg min-w-[200px] z-50 transition-all duration-200 ${openDropdown === category
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                      }`}
                  >
                    {subcategories[category].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => handleCategoryClick(sub)}
                        className="block w-full text-left px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap transition-colors"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
            {mainCategories.map((category) => (
              <div key={category} className="border-b border-gray-100 last:border-0">
                {subcategories[category] ? (
                  <>
                    <button
                      onClick={() => toggleMobileCategory(category)}
                      className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
                    >
                      {category}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${mobileOpenCategory === category ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {mobileOpenCategory === category && (
                      <div className="pl-4 pb-2 space-y-2">
                        {subcategories[category].map((sub) => (
                          <button
                            key={sub}
                            onClick={() => handleCategoryClick(sub)}
                            className="block w-full text-left py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate(`/collections/${category.toLowerCase().replace(/\s+&\s+/g, '')}`);
                    }}
                    className="w-full py-4 text-left text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
                  >
                    {category}
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
