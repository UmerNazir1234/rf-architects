"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/dashboard/ProductForm"
import { productService } from "@/services/product.service"
import { useToast } from "@/hooks/use-toast"
import type { ProductFormValues } from "@/models/product.model"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { toast } = useToast()
  const [initialValues, setInitialValues] = useState<ProductFormValues | undefined>()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      if (!params?.id) return
      const response = await productService.getProductById(params.id)
      if (response.success && response.data) {
        setInitialValues({
          name: response.data.name,
          slug: response.data.slug,
          sku: response.data.sku,
          price: response.data.price,
          compareAtPrice: response.data.compareAtPrice,
          category: response.data.category,
          collection: response.data.collection,
          collections: response.data.collections ?? [],
          images: response.data.images ?? [],
          description: response.data.description,
          productDetails: response.data.productDetails ?? [],
          inStock: response.data.inStock,
          stockNote: response.data.stockNote ?? "",
          hasVariants: response.data.hasVariants ?? false,
          variantGroups: response.data.variantGroups ?? [],
          options: response.data.options ?? [],
          variants: response.data.variants ?? [],
          relatedProducts: response.data.relatedProducts ?? [],
          isActive: response.data.isActive,
        })
      }
    }

    loadProduct()
  }, [params?.id])

  const handleSubmit = async (values: ProductFormValues) => {
    if (!params?.id) return
    setSubmitting(true)
    const response = await productService.updateProduct(params.id, values)
    setSubmitting(false)

    if (response.success) {
      toast({
        title: "Success",
        description: "Product updated successfully",
        variant: "default",
      })
      router.push("/products")
      return
    }

    // Show error notification
    toast({
      title: "Error",
      description: response.message || "Failed to update product",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update an existing product.</p>
        </div>
      </div>

      {initialValues ? (
        <ProductForm initialValues={initialValues} submitLabel="Save Changes" submitting={submitting} onSubmit={handleSubmit} />
      ) : (
        <p className="text-muted-foreground">Loading product…</p>
      )}
    </div>
  )
}
