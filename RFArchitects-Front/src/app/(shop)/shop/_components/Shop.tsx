"use client";
import { useState, useMemo, useEffect } from "react";
import { dedupeProducts, fetchProducts } from "@/lib/api";
import { Filter, LayoutGrid, LayoutList } from "lucide-react";
import ProductCard from "@/components/product-card";
import { getCompareAtPrice, getDisplayPrice } from "@/lib/utils";

export default function Shop() {
    const [displayCount, setDisplayCount] = useState(12);
    const [viewType, setViewType] = useState("grid");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCollection, setSelectedCollection] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortOption, setSortOption] = useState("default");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchProducts();
                const backendProducts = data?.products || [];
                setProducts(backendProducts);
            } catch (err) {
                console.error(err);
                setError("Unable to load products right now.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const allProducts = useMemo(() => dedupeProducts(products), [products]);

    const collectionOptions = useMemo(() => {
        const values = new Map<string, string>();
        allProducts.forEach((product) => {
            const collection = product.collection || product.collections?.[0] || null;
            const name = typeof collection === "string" ? collection : collection?.name || "";
            const id = typeof collection === "string" ? collection : collection?.id || collection?._id || "";
            if (name && id) values.set(id, name);
        });
        return Array.from(values.entries()).map(([id, name]) => ({ id, name }));
    }, [allProducts]);

    const categoryOptions = useMemo(() => {
        const values = new Map<string, string>();
        allProducts.forEach((product) => {
            const category = product.category || null;
            const name = typeof category === "string" ? category : category?.name || "";
            const id = typeof category === "string" ? category : category?.id || category?._id || "";
            if (name && id) values.set(id, name);
        });
        return Array.from(values.entries()).map(([id, name]) => ({ id, name }));
    }, [allProducts]);

    const filteredProducts = useMemo(() => {
        const filtered = allProducts.filter((product) => {
            const productCollection = product.collection || product.collections?.[0] || null;
            const collectionId = typeof productCollection === "string" ? productCollection : productCollection?.id || productCollection?._id || "";
            const productCategory = product.category || null;
            const categoryId = typeof productCategory === "string" ? productCategory : productCategory?.id || productCategory?._id || "";
            const matchesCollection = selectedCollection === "all" || collectionId === selectedCollection;
            const matchesCategory = selectedCategory === "all" || categoryId === selectedCategory;
            return matchesCollection && matchesCategory;
        });

        // Apply sorting
        const sorted = [...filtered];
        if (sortOption === "price-low-high") {
            sorted.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
        } else if (sortOption === "price-high-low") {
            sorted.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
        } else if (sortOption === "newest") {
            sorted.reverse();
        }
        return sorted;
    }, [allProducts, selectedCollection, selectedCategory, sortOption]);

    const displayedProducts = filteredProducts.slice(0, displayCount);
    const hasMore = displayCount < filteredProducts.length;

    const handleLoadMore = () => {
        setDisplayCount((prev) => Math.min(prev + 12, filteredProducts.length));
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="border-b border-gray-200 px-6 py-12">
                <h1 className="mb-4 text-4xl font-light">Shop All</h1>
                <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                    Browse every product from the backend catalog, with the same product detail flow used across the entire storefront.
                </p>
            </div>

            <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-6 py-6">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    <span className="text-sm text-gray-600">{filteredProducts.length} Results</span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <select value={selectedCollection} onChange={(e) => { setSelectedCollection(e.target.value); setDisplayCount(12); }} className="rounded border border-gray-300 bg-white px-3 py-2 text-sm">
                        <option value="all">All Collections</option>
                        {collectionOptions.map((option) => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                    <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setDisplayCount(12); }} className="rounded border border-gray-300 bg-white px-3 py-2 text-sm">
                        <option value="all">All Categories</option>
                        {categoryOptions.map((option) => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                    <div className="flex gap-2">
                        <button onClick={() => setViewType("grid")} className={`rounded p-2 ${viewType === "grid" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:text-gray-900"}`}>
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button onClick={() => setViewType("list")} className={`rounded p-2 ${viewType === "list" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:text-gray-900"}`}>
                            <LayoutList className="h-4 w-4" />
                        </button>
                    </div>
                    <select value={sortOption} onChange={(e) => { setSortOption(e.target.value); setDisplayCount(12); }} className="rounded border border-gray-300 bg-white px-3 py-2 text-sm">
                        <option value="default">Sort: Default</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            <div className="px-6 py-12">
                {loading ? (
                    <div className="flex min-h-48 items-center justify-center text-gray-600">Loading products...</div>
                ) : error ? (
                    <div className="flex min-h-48 items-center justify-center text-red-600">{error}</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex min-h-48 items-center justify-center text-gray-600">No products are available right now.</div>
                ) : (
                    <div className={viewType === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid grid-cols-1 gap-6"}>
                        {displayedProducts.map((product) => (
                            <div key={product.id || product._id} className="cursor-pointer">
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
                )}

                {hasMore && !loading && !error && filteredProducts.length > 0 && (
                    <div className="mt-12 flex justify-center">
                        <button onClick={handleLoadMore} className="rounded-sm border border-gray-800 px-8 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-800 hover:text-white">
                            Load More
                        </button>
                    </div>
                )}

                {!hasMore && displayedProducts.length > 0 && !loading && !error && (
                    <div className="mt-12 text-center text-sm text-gray-500">You have reached the end of the list</div>
                )}
            </div>
        </div>
    );
}
