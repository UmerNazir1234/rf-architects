import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "./product-card";
import { productsData } from "../lib/products-data";
import { Filter, LayoutGrid, LayoutList } from "lucide-react";


export default function CollectionPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const [displayCount, setDisplayCount] = useState(12);
  const [viewType, setViewType] = useState("grid");



  // ✅ Category Titles & Descriptions
  const categoryTitles: Record<string, string> = {
    dining: "Dining Tables",
    chairs: "Dining Chairs",
    beds: "Beds",
    lamps: "Lamps",
    living: "Living Room",
    storage: "Storage & Consoles",
    outdoor: "Outdoor",
    accessories: "Accessories",
  };

  const categoryDescriptions: Record<string, string> = {
    dining:
      "Gather around pieces that set the scene for shared moments. From warm timber to refined ceramic tops, in round, oval, or rectangular shapes, our dining table invites connection, anchors conversation, and becomes a lasting canvas for everyday meals and special celebrations.",
    chairs:
      "Comfortable and stylish dining chairs that complement your table perfectly. Choose from various designs and materials to create your ideal dining space.",
    beds: "Rest easy with our curated collection of beds. From modern frames to classic designs, find the perfect bed for your bedroom.",
    lamps:
      "Illuminate your space with our selection of lamps. From table lamps to floor lamps, add warmth and style to any room.",
    living:
      "Create your perfect living room with our collection of sofas, chairs, and tables.",
    storage:
      "Organize your space with our storage solutions and console tables.",
    outdoor:
      "Bring comfort to your outdoor spaces with our outdoor furniture collection.",
    accessories:
      "Complete your home with our selection of accessories and decor.",
  };

  const [sortOption, setSortOption] = useState("default");

  // ✅ Filter products by category
  const filteredProducts = useMemo(() => {
    if (!category) return [];
    let products = [...(productsData[category] || [])];

    if (sortOption === "price-asc") {
      products.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
        return priceA - priceB;
      });
    } else if (sortOption === "price-desc") {
      products.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
        return priceB - priceA;
      });
    } else if (sortOption === "newest") {
      // Assuming products have an id or some field to sort by newness, 
      // otherwise we can just reverse the array as a proxy for "newest added"
      products.reverse();
    }

    return products;
  }, [category, sortOption]);

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 12, filteredProducts.length));
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Top Navigation */}
      {/* <Navigation onCategorySelect={setSelectedCategory} /> */}

      {/* Hero Section */}
      {/* <div className="grid grid-cols-2 gap-8 px-6 py-12 border-b border-gray-200">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-light mb-4">
            {categoryTitles[category ?? ""] || "Collection"}
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            {categoryDescriptions[category ?? ""]}
          </p>
        </div>
        <div className="bg-gray-200 rounded-sm aspect-video flex items-center justify-center overflow-hidden">
          <img
            src={`/${
              category ?? "placeholder"
            }.jpg?height=400&width=600&query=${
              categoryTitles[category ?? ""]
            } furniture`}
            alt={categoryTitles[category ?? ""]}
            className="w-full h-full object-cover rounded-sm"
          />
        </div>
      </div> */}

      {/* Filters and View Options */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-6 border-b border-gray-200 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <span className="text-xs sm:text-sm text-gray-600">
            {filteredProducts.length} Results
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewType("grid")}
              className={`p-2 rounded ${viewType === "grid"
                ? "bg-gray-200 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`p-2 rounded ${viewType === "list"
                ? "bg-gray-200 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
          <select
            className="text-xs sm:text-sm border border-gray-300 rounded px-2 sm:px-3 py-2 bg-white"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Sort: Bestselling</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 py-12 max-sm:px-3">
        <div
          className={
            viewType === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              : "grid grid-cols-1 gap-6"
          }
        >
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="cursor-pointer"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                details={product.description}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 border border-gray-800 text-gray-800 font-medium hover:bg-gray-800 hover:text-white transition-colors rounded-sm"
            >
              Load More
            </button>
          </div>
        )}

        {!hasMore && displayedProducts.length > 0 && (
          <div className="text-center mt-12 text-gray-500 text-sm">
            No more products to load
          </div>
        )}
      </div>

    </div>
  );
}
