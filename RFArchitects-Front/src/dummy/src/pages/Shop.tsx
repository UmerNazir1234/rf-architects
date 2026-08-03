
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/product-card";
import { productsData } from "@/lib/products-data";
import { Filter, LayoutGrid, LayoutList } from "lucide-react";
import Navigation from "@/components/navigation";


export default function Shop() {
    const navigate = useNavigate();
    const [displayCount, setDisplayCount] = useState(12);
    const [viewType, setViewType] = useState("grid");
    const [selectedCategory, setSelectedCategory] = useState("shop");

    // Flatten all products into one array
    const allProducts = useMemo(() => {
        return Object.values(productsData).flat();
    }, []);

    const displayedProducts = allProducts.slice(0, displayCount);
    const hasMore = displayCount < allProducts.length;

    const handleLoadMore = () => {
        setDisplayCount((prev) => Math.min(prev + 12, allProducts.length));
    };

    const handleProductClick = (productId: string) => {
        navigate(`/products/${productId}`);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navigation onCategorySelect={setSelectedCategory} />

            <div className="px-6 py-12 border-b border-gray-200">
                <h1 className="text-4xl font-light mb-4">Shop All</h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                    Explore our complete collection of premium furniture and accessories.
                    From statement dining tables to refined lighting, discover pieces that transform your space.
                </p>
            </div>

            {/* Filters and View Options */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 sticky top-0 bg-white z-10 flex-wrap gap-2">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <span className="text-sm text-gray-600">
                        {allProducts.length} Results
                    </span>
                </div>
                <div className="flex items-center gap-4">
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
                    <select className="text-sm border border-gray-300 rounded px-3 py-2 bg-white">
                        <option>Sort: Default</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Newest</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <div className="px-6 py-12">
                <div
                    className={
                        viewType === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
                        You've reached the end of the list
                    </div>
                )}
            </div>

        </div>
    );
}
