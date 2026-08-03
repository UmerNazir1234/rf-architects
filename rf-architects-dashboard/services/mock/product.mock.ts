import { mockDb } from "./db"
import type { Product, ProductFormValues } from "@/models/product.model"
import type { ApiResponse, PaginatedResponse, ListParams } from "@/models/common.model"
import { randomDelay } from "@/lib/delay"
import { v4 as uuidv4 } from "crypto"

// Helper to generate slug from name
const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
}

// Helper to generate UUID (browser-safe)
const generateId = () => `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const productMockApi = {
  async getProducts(params?: ListParams): Promise<ApiResponse<PaginatedResponse<Product>>> {
    await randomDelay()

    let products = [...mockDb.products]

    // Search
    if (params?.search) {
      const search = params.search.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.slug.includes(search) ||
          p.sku.includes(search)
      )
    }

    // Filter by category
    if (params?.category) {
      products = products.filter((p) => p.category === params.category)
    }

    // Filter by collection
    if (params?.collection) {
      products = products.filter((p) => p.collection === params.collection)
    }

    // Filter by stock
    if (params?.inStock !== undefined) {
      products = products.filter((p) => p.inStock === params.inStock)
    }

    // Sort
    if (params?.sort) {
      if (params.sort === "price") {
        products.sort((a, b) => (params.order === "desc" ? b.price - a.price : a.price - b.price))
      } else if (params.sort === "newest") {
        products.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }
    }

    // Pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const start = (page - 1) * limit
    const paginatedProducts = products.slice(start, start + limit)

    return {
      success: true,
      data: {
        items: paginatedProducts,
        page,
        totalPages: Math.ceil(products.length / limit),
        totalResults: products.length,
      },
    }
  },

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    await randomDelay()
    const product = mockDb.products.find((p) => p.id === id)
    if (!product) {
      return { success: false, message: "Product not found" }
    }
    return { success: true, data: product }
  },

  async createProduct(data: ProductFormValues): Promise<ApiResponse<Product>> {
    await randomDelay()
    const newProduct: Product = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDb.products.push(newProduct)
    return { success: true, data: newProduct, message: "Product created successfully" }
  },

  async updateProduct(id: string, data: Partial<ProductFormValues>): Promise<ApiResponse<Product>> {
    await randomDelay()
    const index = mockDb.products.findIndex((p) => p.id === id)
    if (index === -1) {
      return { success: false, message: "Product not found" }
    }
    const updated = {
      ...mockDb.products[index],
      ...data,
      id,
      createdAt: mockDb.products[index].createdAt,
      updatedAt: new Date(),
    }
    mockDb.products[index] = updated
    return { success: true, data: updated, message: "Product updated successfully" }
  },

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    await randomDelay()
    const index = mockDb.products.findIndex((p) => p.id === id)
    if (index === -1) {
      return { success: false, message: "Product not found" }
    }
    mockDb.products.splice(index, 1)
    return { success: true, data: null, message: "Product deleted successfully" }
  },

  async toggleProductPublish(id: string, isActive: boolean): Promise<ApiResponse<Product>> {
    await randomDelay()
    const product = mockDb.products.find((p) => p.id === id)
    if (!product) {
      return { success: false, message: "Product not found" }
    }
    product.isActive = isActive
    product.updatedAt = new Date()
    return { success: true, data: product, message: "Product status updated" }
  },

  async bulkPublish(ids: string[], isActive: boolean): Promise<ApiResponse<null>> {
    await randomDelay()
    ids.forEach((id) => {
      const product = mockDb.products.find((p) => p.id === id)
      if (product) {
        product.isActive = isActive
        product.updatedAt = new Date()
      }
    })
    return { success: true, data: null, message: "Products updated successfully" }
  },

  async bulkDelete(ids: string[]): Promise<ApiResponse<null>> {
    await randomDelay()
    mockDb.products = mockDb.products.filter((p) => !ids.includes(p.id))
    return { success: true, data: null, message: "Products deleted successfully" }
  },
}
