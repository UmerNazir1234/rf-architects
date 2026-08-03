"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/dashboard/ProductForm"
import { productService } from "@/services/product.service"
import { useToast } from "@/hooks/use-toast"
import type { ProductFormValues } from "@/models/product.model"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: ProductFormValues) => {
    setSubmitting(true)
    const response = await productService.createProduct(values)
    setSubmitting(false)

    if (response.success) {
      toast({
        title: "Success",
        description: "Product created successfully",
        variant: "default",
      })
      router.push("/products")
      return
    }

    // Show error notification
    toast({
      title: "Error",
      description: response.message || "Failed to create product",
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
          <h1 className="text-3xl font-bold">Create Product</h1>
          <p className="text-muted-foreground">Create a new product for the catalog.</p>
        </div>
      </div>

      <ProductForm submitLabel="Create Product" submitting={submitting} onSubmit={handleSubmit} />
    </div>
  )
}
