"use client";
import { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Check,
    MessageSquare,
    ShoppingCart,
} from "lucide-react";

import { productsData } from "@/lib/products-data";
import { dedupeProducts, fetchProductById, fetchProductBySlug, fetchProducts } from "@/lib/api";
import { addToCart } from "@/lib/cart";
import { getCompareAtPrice, getDisplayPrice } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Site } from "@/lib/site";
import ProductVariants from "./ProductVariants";

const normalizeImageValue = (img: any) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    return img.url || img.secure_url || img.image || "";
};

const normalizeImageList = (value: any) => {
    if (Array.isArray(value)) {
        return value.map(normalizeImageValue).filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
        return [value];
    }

    return [];
};

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const id: any = params?.id;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);
    const [displayPrice, setDisplayPrice] = useState<number>(0);

    // Helper function to calculate variant price based on selected attributes
    const calculateVariantPrice = (attrs: Record<string, string>, prod: any): number => {
        if (!prod || !attrs || Object.keys(attrs).length === 0) {
            return prod?.price || 0;
        }

        // Collect prices from each selected variant option
        const prices: number[] = [];
        const variantGroups = Array.isArray(prod?.variantGroups) && prod.variantGroups.length > 0
            ? prod.variantGroups
            : Array.isArray(prod?.options) && prod.options.length > 0
                ? prod.options
                : [];

        for (const group of variantGroups) {
            const selectedValue = attrs[group.name];
            if (selectedValue && group.options) {
                const option = group.options.find((opt: any) => opt.value === selectedValue);
                if (option && typeof option.price === 'number') {
                    prices.push(option.price);
                }
            }
        }

        // If we have variant prices, sum them. Otherwise use base price.
        if (prices.length > 0) {
            return prices.reduce((sum, p) => sum + p, 0);
        }

        return prod?.price || 0;
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            if (id) {
                let data = await fetchProductById(id);
                if (!data) {
                    data = await fetchProductBySlug(id);
                }
                if (data) {
                    const images = normalizeImageList(data.images || data.media || []);
                    const featuredImage =
                        normalizeImageValue(data.images?.find((img: any) => img?.isFeatured)) ||
                        images[0] ||
                        data.image ||
                        "";

                    const normalized = {
                        ...data,
                        description: data.description || "",
                        media: images,
                        image: featuredImage,
                        productDetails: data.productDetails || [],
                    };
                    setProduct(normalized);
                    setDisplayPrice(normalized.price || 0);
                } else {
                    // Fallback
                    let found: any = null;
                    for (const category of Object.values(productsData)) {
                        const match = (category as any[]).find((p) => p.id === id || p.slug === id);
                        if (match) {
                            found = match;
                            break;
                        }
                    }
                    setProduct(found);
                    setDisplayPrice(found?.price || 0);
                }
            }
            setLoading(false);
        };
        load();
    }, [id]);

    // Update displayed price when variant attributes change
    useEffect(() => {
        if (product) {
            const newPrice = calculateVariantPrice(selectedAttributes, product);
            setDisplayPrice(newPrice);
        }
    }, [selectedAttributes, product]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-600">Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-600">Product not found</p>
                </div>
            </div>
        );
    }

    const compareAtPrice = getCompareAtPrice(product);

    const productImages = (() => {
        const gallery = Array.isArray(product?.media)
            ? product.media.filter((img: string) => img && img.trim() !== "")
            : [];

        const seen = new Set<string>();
        const images: string[] = [];

        const addImage = (img?: string) => {
            if (!img || !img.trim()) return;
            const normalized = img.trim();
            if (seen.has(normalized)) return;
            seen.add(normalized);
            images.push(normalized);
        };

        addImage(product?.image);
        gallery.forEach((img: string) => addImage(img));

        return images.length > 0 ? images : [product?.image || "/placeholder.svg"];
    })();

    const nextImage = () =>
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    const prevImage = () =>
        setCurrentImageIndex(
            (prev) => (prev - 1 + productImages.length) % productImages.length
        );

    const handleAddToCart = () => {
        if (!product) return;
        
        addToCart({
            id: product.id,
            cartItemId: "",  // let cart.ts generate it
            name: product.name,
            price: displayPrice,
            image: product.image,
            quantity,
            collection: product.collection?.name || product.collection || "Uncategorized",
            category: product.category?.name || product.category || "Uncategorized",
            variant: selectedAttributes,
        });

        router.push("/cart");
    };

    const handleGetQuote = () => {
        let message = `Hi, I'm interested in the following product:\n\n`;
        message += `*Product:* ${product.name}\n`;
        message += `*SKU:* ${product.sku}\n`;
        message += `*Quantity:* ${quantity}\n`;

        if (Object.keys(selectedAttributes).length > 0) {
            message += `*Selections:* ${Object.entries(selectedAttributes).map(([key, value]) => `${key}: ${value}`).join(', ')}\n`;
        }

        message += `\nCould you please provide a quote?`;

        const url = `https://wa.me/${Site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };


    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 py-12">
                {/* Image Slider */}
                <div className="flex flex-col gap-4">
                    <div className="relative bg-gray-100 aspect-square overflow-hidden rounded-sm">
                        <img
                            src={productImages[currentImageIndex] || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover h-full w-full"
                        />

                        {/* Slider Controls */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow z-10"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow z-10"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {productImages.length}
                        </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className="grid grid-cols-4 gap-2">
                        {productImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-colors ${idx === currentImageIndex
                                    ? "border-gray-800"
                                    : "border-gray-200"
                                    }`}
                            >
                                <img
                                    src={img || "/placeholder.svg"}
                                    alt={`View ${idx + 1}`}
                                    className="object-cover w-full h-full"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-6">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">
                            Collection &gt; Product
                        </p>
                        <h1 className="text-4xl font-light mb-2">{product.name}</h1>
                        {product.sku && (
                            <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>
                        )}
                        <p className="text-2xl font-medium text-gray-800">
                            Rs. {typeof displayPrice === 'number' ? displayPrice.toLocaleString() : displayPrice}
                        </p>
                        {product.description && (
                            <p className="mt-4 text-sm leading-7 text-gray-600">{product.description}</p>
                        )}
                    </div>
                    <ProductVariants
                        product={product}
                        selectedAttributes={selectedAttributes}
                        onAttributeChange={(group, value) => setSelectedAttributes(prev => ({ ...prev, [group]: value }))}
                        quantity={quantity}
                        onQuantityChange={setQuantity}
                    />
                    {/* Stock Status */}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-5 h-5 text-green-600" />
                        In stock - Ships in 3 to 5 days
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className="cursor-pointer w-full py-4 font-medium text-white bg-gray-900 hover:bg-black rounded-sm transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        ADD TO CART
                    </button>

                    {/* Get a Quote Button */}
                    <button
                        onClick={handleGetQuote}
                        className="cursor-pointer w-full py-4 font-medium text-white bg-green-600 hover:bg-green-700 rounded-sm transition-all flex items-center justify-center gap-2"
                    >
                        <MessageSquare className="w-5 h-5" />
                        GET A QUOTE VIA WHATSAPP
                    </button>

                    {/* Wishlist Removed */}

                    {/* Product Features */}
                    <div className="border-t border-gray-200 pt-6 space-y-4">
                        <Feature
                            icon="📦"
                            title="Complimentary Delivery & Setup"
                            desc="Above $2K"
                        />
                        <Feature
                            icon="✓"
                            title="Quality Assured Warranty Coverage"
                            desc="Full coverage included"
                        />
                        <Feature
                            icon="🎨"
                            title="Complimentary Styling Services"
                            desc="Expert design consultation"
                        />
                        <Feature
                            icon="⚡"
                            title="Fast Local Service Support"
                            desc="Quick response time"
                        />
                    </div>
                </div>
            </div>

            {/* Product Details Accordion */}
            <div className="border-t border-gray-200 px-6 py-12">
                <div className="max-w-4xl">
                    <h2 className="text-2xl font-light mb-8">Product Details</h2>

                    {/* Description */}
                    {product.description && (
                        <Accordion title="DESCRIPTION">
                            <p className="leading-7 text-gray-700">{product.description}</p>
                        </Accordion>
                    )}

                    {/* Dynamic Product Details */}
                    {product.productDetails && product.productDetails.length > 0 && (
                        <>
                            {product.productDetails.map((detail: any, idx: number) => (
                                <Accordion key={idx} title={detail.label.toUpperCase()}>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{detail.value}</p>
                                </Accordion>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Related Products */}
            <RelatedProducts currentProductId={id} currentProduct={product} />

        </div>
    );
}

// 🔹 Related Products Component
function RelatedProducts({ currentProductId, currentProduct }: { currentProductId?: string; currentProduct?: any }) {
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    useEffect(() => {
        const loadRelatedProducts = async () => {
            if (!currentProduct) return;

            const categoryValue = currentProduct?.category;
            const categoryId = categoryValue?.id || categoryValue?._id || categoryValue?.slug || (typeof categoryValue === "string" ? categoryValue : "");

            if (categoryId) {
                const data = await fetchProducts({ category: categoryId });
                const products = dedupeProducts(data?.products || []);
                const filtered = products.filter((product: any) => {
                    const productId = product.id || product._id || product.slug;
                    return productId && productId !== currentProductId && product.slug;
                }).slice(0, 4);

                if (filtered.length > 0) {
                    setRelatedProducts(filtered);
                    return;
                }
            }

            const categoryKey = (() => {
                if (typeof categoryValue === "string") return categoryValue;
                if (categoryValue?.name) return categoryValue.name;
                if (categoryValue?.slug) return categoryValue.slug;

                for (const [key, items] of Object.entries(productsData)) {
                    if (Array.isArray(items) && items.some((product: any) => product.id === currentProduct?.id || product.slug === currentProduct?.slug || product.name === currentProduct?.name)) {
                        return key;
                    }
                }

                return null;
            })();

            const fallbackProducts = Object.values(productsData).flat() as any[];
            const related = fallbackProducts
                .filter((product: any) => {
                    const productId = product.id || product.slug;
                    const sameCategory = !categoryKey || product.category === categoryKey || product.categoryName === categoryKey || product.slug?.includes(categoryKey) || product.name?.toLowerCase().includes(categoryKey.toLowerCase());
                    return productId && productId !== currentProductId && product.slug && sameCategory;
                })
                .slice(0, 4);

            setRelatedProducts(related.length > 0 ? related : fallbackProducts.filter((product: any) => {
                const productId = product.id || product.slug;
                return productId && productId !== currentProductId && product.slug;
            }).slice(0, 4));
        };

        loadRelatedProducts();
    }, [currentProductId, currentProduct]);

    return (
        <div className="border-t border-gray-200 px-6 py-12">
            <h2 className="text-2xl font-light mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((product: any) => (
                    <Link key={product.id || product.slug || product._id} href={`/products/${product.slug || product.id || product._id}`} className="group block">
                        <div className="aspect-square overflow-hidden bg-gray-100 mb-4 rounded-sm relative">
                            <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-1">
                            {product.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                            <p className="text-sm text-gray-500">Rs. {typeof getDisplayPrice(product) === 'number' ? getDisplayPrice(product).toLocaleString() : getDisplayPrice(product)}</p>
                            {getCompareAtPrice(product) !== null && getCompareAtPrice(product)! > 0 && (
                                <p className="text-sm text-gray-400 line-through">Rs. {getCompareAtPrice(product)!.toLocaleString()}</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

// 🔹 Helper components
function Feature({
    icon,
    title,
    desc,
}: {
    icon: string;
    title: string;
    desc: string;
}) {
    return (
        <div className="flex items-start gap-4">
            <div className="text-2xl">{icon}</div>
            <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-gray-600">{desc}</p>
            </div>
        </div>
    );
}

export function Accordion({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 pb-4">
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center font-medium text-gray-800 cursor-pointer py-3"
            >
                <span>{title}</span>
                <span className="text-xl font-light transition-all duration-200">
                    {isOpen ? "−" : "+"}
                </span>
            </button>

            {/* Smooth Animated Content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden mt-2 text-sm text-gray-600 space-y-2"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
