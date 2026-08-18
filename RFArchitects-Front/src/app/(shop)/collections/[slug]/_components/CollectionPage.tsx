"use client";
import { useState, useMemo, useEffect } from "react";
import { Filter, LayoutGrid, LayoutList } from "lucide-react";
import { useParams } from "next/navigation";
import { Product, products } from "@/lib/products";
import ProductCard from "@/components/product-card";
import { Collection, collections } from "@/lib/collections";
import { dedupeProducts, fetchCollectionBySlug } from "@/lib/api";
import { getCompareAtPrice, getDisplayPrice } from "@/lib/utils";


export default function CollectionPage() {
    const [collection, setCollection] = useState<Collection | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const slug = params.slug as string;

    const [displayCount, setDisplayCount] = useState(12);
    const [viewType, setViewType] = useState("grid");
    const [sortOption, setSortOption] = useState("default");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            if (slug) {
                const data = await fetchCollectionBySlug(slug);
                if (data && data.collection) {
                    setCollection({
                        id: data.collection._id || data.collection.id,
                        name: data.collection.name,
                        slug: data.collection.slug,
                        image: data.collection.coverImage || data.collection.image || "/placeholder.svg",
                        description: data.collection.description,
                    });
                    setAllProducts(dedupeProducts(data.products || []));
                } else {
                    // Fallback
                    const foundCollection = collections.find(c => c.slug === slug);
                    if (foundCollection) {
                        setCollection(foundCollection);
                        const filtered = products.filter(p => p.collection === foundCollection.name);
                        setAllProducts(filtered);
                    }
                }
            }
            setLoading(false);
        };
        load();
    }, [slug]);

    // ✅ Filter and Sort products
    const filteredProducts = useMemo(() => {
        const items = [...allProducts];

        if (sortOption === "price-low-high") {
            items.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
        } else if (sortOption === "price-high-low") {
            items.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
        } else if (sortOption === "newest") {
            items.reverse();
        }

        return items;
    }, [allProducts, sortOption]);

    const displayedProducts = filteredProducts.slice(0, displayCount);
    const hasMore = displayCount < filteredProducts.length;

    const handleLoadMore = () => {
        setDisplayCount((prev) => Math.min(prev + 12, filteredProducts.length));
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!collection) {
        return <div className="min-h-screen flex items-center justify-center">Collection not found</div>;
    }


    return (
        <div className="min-h-screen bg-white">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-4 border-b border-gray-200">
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-light mb-4">
                        {collection.name}
                    </h1>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {collection.description || `Discover our curated collection of ${collection.name.toLowerCase()}. Each piece is designed to bring elegance and functionality to your space.`}
                    </p>
                </div>
                <div className="bg-gray-200 rounded-sm aspect-video flex items-center justify-center overflow-hidden">
                    <img
                        src={collection.image || "/placeholder.svg"}
                        alt={collection.name}
                        className="w-full h-full object-cover rounded-sm"
                    />
                </div>
            </div>

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
                        <option value="default">Sort: Default</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
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
                    {displayedProducts.map((product: any) => (
                        <div
                            key={product.id || product._id}
                            className="cursor-pointer"
                        >
                            <ProductCard
                                id={product.id || product._id}
                                slug={product.slug}
                                name={product.name}
                                price={getDisplayPrice(product)}
                                image={product.image || product.images?.[0]?.url || product.images?.[0] || "/placeholder.svg"}
                                details={product.description}
                                collectionName={typeof product.collection === "object" ? product.collection?.name : product.collectionName || product.collection}
                                categoryName={typeof product.category === "object" ? product.category?.name : product.categoryName || product.category}
                                compareAtPrice={getCompareAtPrice(product)}
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
