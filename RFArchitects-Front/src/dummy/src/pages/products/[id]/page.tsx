
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MessageSquare,
} from "lucide-react";

import { productsData } from "@/lib/products-data";
import { AnimatePresence, motion } from "framer-motion";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>(); // ✅ get from route

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Find product across all categories
  let product: any = null;
  for (const category of Object.values(productsData)) {
    const found = (category as any[]).find((p) => p.id === id);
    if (found) {
      product = found;
      break;
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        {/* <Navigation onCategorySelect={setSelectedCategory} /> */}
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Product not found</p>
        </div>
      </div>
    );
  }

  // Use actual product media from product data
  const productImages = product.media && product.media.length > 0
    ? [product.image, ...product.media.filter((img: string) => img && img.trim() !== '')]
    : [product.image];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );

  const handleGetQuote = () => {
    const message = `Hi, I'm interested in ${product.name} (SKU: ${product.sku}). Could you please provide a quote?`;
    const url = `https://wa.me/923344738506?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <Navigation onCategorySelect={setSelectedCategory} /> */}

      {/* Product Detail Section */}
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
              {/* Breadcrumb could be dynamic based on category if we had it passed or derived */}
              Collection &gt; Product
            </p>
            <h1 className="text-4xl font-light mb-2">{product.name}</h1>
            {product.sku && (
              <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>
            )}
            <p className="text-2xl font-medium text-gray-800">
              Rs. {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Check className="w-5 h-5 text-green-600" />
            In stock - Ships in 3 to 5 days
          </div>

          {/* Get a Quote Button */}
          <button
            onClick={handleGetQuote}
            className="w-full py-4 font-medium text-white bg-green-600 hover:bg-green-700 rounded-sm transition-all flex items-center justify-center gap-2"
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

          {/* Dimensions */}
          {product.dimensions && (
            <Accordion title="DIMENSIONS">
              {product.dimensions.length && <p>Length: {product.dimensions.length}</p>}
              {product.dimensions.width && <p>Width: {product.dimensions.width}</p>}
              {product.dimensions.height && <p>Height: {product.dimensions.height}</p>}
              {product.dimensions.weight && <p>Weight: {product.dimensions.weight}</p>}
              {product.dimensions.packageDimensions && <p>Package Dimensions: {product.dimensions.packageDimensions}</p>}
              {product.dimensions.packageWeight && <p>Package Weight: {product.dimensions.packageWeight}</p>}
            </Accordion>
          )}

          {/* Materials & Features */}
          {product.materialsAndFeatures && (
            <Accordion title="MATERIALS & FEATURES">
              {product.materialsAndFeatures.materials && product.materialsAndFeatures.materials.length > 0 && (
                <div className="mb-3">
                  <p className="font-medium mb-1">Materials:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {product.materialsAndFeatures.materials.map((material: string, idx: number) => (
                      <li key={idx}>{material}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.materialsAndFeatures.features && product.materialsAndFeatures.features.length > 0 && (
                <div className="mb-3">
                  <p className="font-medium mb-1">Features:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {product.materialsAndFeatures.features.map((feature: string, idx: number) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.materialsAndFeatures.colors && product.materialsAndFeatures.colors.length > 0 && (
                <p>Available Colors: {product.materialsAndFeatures.colors.join(', ')}</p>
              )}
              {product.materialsAndFeatures.finish && <p>Finish: {product.materialsAndFeatures.finish}</p>}
            </Accordion>
          )}

          {/* Product Care */}
          {product.productCare && product.productCare.length > 0 && (
            <Accordion title="PRODUCT CARE">
              <ul className="list-disc list-inside space-y-1">
                {product.productCare.map((care: string, idx: number) => (
                  <li key={idx}>{care}</li>
                ))}
              </ul>
            </Accordion>
          )}

          {/* Assembly Information */}
          {product.assembly && (
            <Accordion title="ASSEMBLY INFORMATION">
              {product.assembly.required && <p>Assembly Required: {product.assembly.required}</p>}
              {product.assembly.time && <p>Estimated Time: {product.assembly.time}</p>}
              {product.assembly.difficulty && <p>Difficulty Level: {product.assembly.difficulty}</p>}
              {product.assembly.tools && product.assembly.tools.length > 0 && (
                <p>Tools Needed: {product.assembly.tools.join(', ')}</p>
              )}
              {product.assembly.instructions && <p>Instructions: {product.assembly.instructions}</p>}
            </Accordion>
          )}

          {/* Terms & Conditions */}
          {product.terms && (
            <Accordion title="TERMS & CONDITIONS">
              {product.terms.warranty && <p>Warranty: {product.terms.warranty}</p>}
              {product.terms.returns && <p>Returns: {product.terms.returns}</p>}
              {product.terms.delivery && <p>Delivery: {product.terms.delivery}</p>}
              {product.terms.shipping && <p>Shipping: {product.terms.shipping}</p>}
              {product.terms.damage && <p>Damage Policy: {product.terms.damage}</p>}
            </Accordion>
          )}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProductId={id} />

    </div>
  );
}

// 🔹 Related Products Component
function RelatedProducts({ currentProductId }: { currentProductId?: string }) {
  // Get random products (simple implementation)
  const allProducts = Object.values(productsData).flat();
  const related = allProducts
    .filter(p => p.id !== currentProductId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <div className="border-t border-gray-200 px-6 py-12">
      <h2 className="text-2xl font-light mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`} className="group block">
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
            <p className="text-sm text-gray-500 mt-1">Rs. {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}</p>
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
