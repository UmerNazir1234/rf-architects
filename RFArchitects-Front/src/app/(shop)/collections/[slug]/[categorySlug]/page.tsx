"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { dedupeProducts, fetchCategoriesByCollection, fetchProductsByCategory } from "@/lib/api";
import { getCompareAtPrice, getDisplayPrice } from "@/lib/utils";

export default function CategoryProductsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const categorySlug = params?.categorySlug as string;
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const categoriesData = await fetchCategoriesByCollection(slug);
      const categoryList = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];
      setCategories(categoryList);
      const selectedCategory = categoryList.find((cat: any) => cat.slug === categorySlug || cat.id === categorySlug);
      if (selectedCategory) {
        const productData = await fetchProductsByCategory(selectedCategory.id || selectedCategory._id);
        setProducts(dedupeProducts(productData?.products || []));
      }
      setLoading(false);
    };
    load();
  }, [slug, categorySlug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading products…</div>;

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-light">Products in this category</h1>
          <p className="mt-2 text-sm text-gray-600">Browse the items inside the selected category.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => (
            <Link key={product.id || product._id} href={`/products/${product.slug || product.id || product._id}`} className="rounded border border-gray-200 p-4">
              <img src={product.image || product.images?.[0]?.url || "/placeholder.svg"} alt={product.name} className="mb-4 h-48 w-full rounded object-cover" />
              <h2 className="font-medium text-gray-900">{product.name}</h2>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-sm text-gray-600">Rs. {typeof getDisplayPrice(product) === "number" ? getDisplayPrice(product).toLocaleString() : getDisplayPrice(product)}</p>
                {getCompareAtPrice(product) !== null && getCompareAtPrice(product)! > 0 && (
                  <p className="text-sm text-gray-400 line-through">Rs. {getCompareAtPrice(product)!.toLocaleString()}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
