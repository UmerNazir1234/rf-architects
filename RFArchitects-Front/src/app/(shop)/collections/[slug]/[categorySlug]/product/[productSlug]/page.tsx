"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProductById } from "@/lib/api";

export default function CollectionProductDetailPage() {
  const params = useParams();
  const productSlug = params?.productSlug as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchProductById(productSlug);
      setProduct(data);
      setLoading(false);
    };
    load();
  }, [productSlug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product…</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-light">{product.name}</h1>
        <p className="mt-2 text-sm text-gray-600">{product.description}</p>
      </div>
    </div>
  );
}
