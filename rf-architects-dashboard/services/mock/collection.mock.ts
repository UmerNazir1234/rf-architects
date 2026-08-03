import { mockDb } from "./db"
import type { Collection, CollectionCondition } from "@/models/index"
import type { Product } from "@/models/product.model"
import type { ApiResponse, PaginatedResponse, ListParams } from "@/models/common.model"
import { randomDelay } from "@/lib/delay"

const generateId = () => `coll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const collectionMockApi = {
  async getCollections(params?: ListParams): Promise<ApiResponse<PaginatedResponse<Collection>>> {
    await randomDelay()
    let collections = [...mockDb.collections]

    if (params?.search) {
      const search = params.search.toLowerCase()
      collections = collections.filter((c) => c.name.toLowerCase().includes(search))
    }

    if (params?.category) {
      collections = collections.filter((c) => c.category === params.category)
    }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const start = (page - 1) * limit
    const paginatedCollections = collections.slice(start, start + limit)

    return {
      success: true,
      data: {
        items: paginatedCollections,
        page,
        totalPages: Math.ceil(collections.length / limit),
        totalResults: collections.length,
      },
    }
  },

  async getCollectionById(id: string): Promise<ApiResponse<Collection>> {
    await randomDelay()
    const collection = mockDb.collections.find((c) => c.id === id)
    if (!collection) {
      return { success: false, message: "Collection not found" }
    }
    return { success: true, data: collection }
  },

  async createCollection(data: Partial<Collection>): Promise<ApiResponse<Collection>> {
    await randomDelay()
    const newCollection: Collection = {
      id: generateId(),
      name: data.name || "",
      slug: data.slug || "",
      category: data.category || "",
      coverImage: data.coverImage || "",
      description: data.description || "",
      type: data.type || "manual",
      productIds: data.productIds || [],
      conditions: data.conditions || [],
      matchType: data.matchType || "all",
      isActive: data.isActive !== undefined ? data.isActive : true,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDb.collections.push(newCollection)
    return { success: true, data: newCollection }
  },

  async updateCollection(id: string, data: Partial<Collection>): Promise<ApiResponse<Collection>> {
    await randomDelay()
    const index = mockDb.collections.findIndex((c) => c.id === id)
    if (index === -1) {
      return { success: false, message: "Collection not found" }
    }
    const updated = { ...mockDb.collections[index], ...data, updatedAt: new Date() }
    mockDb.collections[index] = updated
    return { success: true, data: updated }
  },

  async deleteCollection(id: string): Promise<ApiResponse<null>> {
    await randomDelay()
    const index = mockDb.collections.findIndex((c) => c.id === id)
    if (index === -1) {
      return { success: false, message: "Collection not found" }
    }
    mockDb.collections.splice(index, 1)
    return { success: true, data: null }
  },

  async previewCollection(id: string, data?: { conditions: CollectionCondition[]; matchType: "all" | "any" }): Promise<ApiResponse<{ products: Product[]; count: number }>> {
    await randomDelay()
    // Simple mock matching rule
    const products = mockDb.products.filter((p) => p.isActive)
    return { success: true, data: { products, count: products.length } }
  },
}
