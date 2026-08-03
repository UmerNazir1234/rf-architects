"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { productService } from "@/services/product.service"
import type { Product, ProductFormValues } from "@/models/product.model"
import type { ApiResponse, PaginatedResponse, ListParams } from "@/models/common.model"

interface ProductFilters extends ListParams {
  category?: string
  collection?: string
  inStock?: boolean
}

export const useProductController = () => {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalResults: 0 })

  const getProducts = useCallback(async (filters?: ProductFilters) => {
    setLoading(true)
    setError(null)
    try {
      const response = await productService.getProducts(filters)
      if (response.success && response.data) {
        const list = Array.isArray(response.data)
          ? response.data
          : (response.data as any).products || (response.data as any).items || []
        setProducts(list)
        const pag = (response.data as any).pagination || {}
        setPagination({
          page: pag.currentPage || (response.data as any).page || 1,
          totalPages: pag.pages || (response.data as any).totalPages || 1,
          totalResults: pag.total || (response.data as any).totalResults || list.length,
        })
      } else {
        setError(response.message || "Failed to fetch products")
      }
    } catch (err) {
      setError("An error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getProductById = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const response = await productService.getProductById(id)
      if (response.success) {
        return response.data
      }
      setError(response.message || "Product not found")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createProduct = useCallback(async (data: ProductFormValues) => {
    setLoading(true)
    try {
      const response = await productService.createProduct(data)
      if (response.success) {
        toast({
          title: "Success",
          description: "Product created successfully",
        })
        await getProducts()
        return response.data
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create product",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }, [getProducts, toast])

  const updateProduct = useCallback(
    async (id: string, data: Partial<ProductFormValues>) => {
      setLoading(true)
      try {
        const response = await productService.updateProduct(id, data)
        if (response.success) {
          toast({
            title: "Success",
            description: "Product updated successfully",
          })
          await getProducts()
          return response.data
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to update product",
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    },
    [getProducts, toast]
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        const response = await productService.deleteProduct(id)
        if (response.success) {
          toast({
            title: "Success",
            description: "Product deleted successfully",
          })
          await getProducts()
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to delete product",
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    },
    [getProducts, toast]
  )

  const togglePublish = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        const response = await productService.toggleProductPublish(id, isActive)
        if (response.success) {
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isActive } : p))
          )
          toast({
            title: "Success",
            description: `Product ${isActive ? "published" : "unpublished"}`,
          })
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to update product status",
          variant: "destructive",
        })
      }
    },
    [toast]
  )

  const bulkPublish = useCallback(
    async (ids: string[], isActive: boolean) => {
      try {
        const response = await productService.bulkPublish(ids, isActive)
        if (response.success) {
          await getProducts()
          toast({
            title: "Success",
            description: `${ids.length} product(s) updated`,
          })
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Bulk update failed",
          variant: "destructive",
        })
      }
    },
    [getProducts, toast]
  )

  const bulkDelete = useCallback(
    async (ids: string[]) => {
      try {
        const response = await productService.bulkDelete(ids)
        if (response.success) {
          await getProducts()
          toast({
            title: "Success",
            description: `${ids.length} product(s) deleted`,
          })
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Bulk delete failed",
          variant: "destructive",
        })
      }
    },
    [getProducts, toast]
  )

  return {
    products,
    loading,
    error,
    pagination,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    togglePublish,
    bulkPublish,
    bulkDelete,
  }
}
