import { collectionMockApi } from "./mock/collection.mock"
import { apiClient } from "./api/client"
import type { Collection, CollectionCondition } from "@/models/index"
import type { Product } from "@/models/product.model"
import type { ApiResponse, PaginatedResponse, ListParams } from "@/models/common.model"

const USE_MOCK = false

export const collectionService = {
  async getCollections(params?: ListParams): Promise<ApiResponse<PaginatedResponse<Collection>>> {
    if (USE_MOCK) return collectionMockApi.getCollections(params)
    return apiClient.get<PaginatedResponse<Collection>>("/collections/admin/list", params)
  },

  async getCollectionById(id: string): Promise<ApiResponse<Collection>> {
    if (USE_MOCK) return collectionMockApi.getCollectionById(id)
    return apiClient.get<Collection>(`/collections/${id}`)
  },

  async createCollection(data: Partial<Collection>): Promise<ApiResponse<Collection>> {
    if (USE_MOCK) return collectionMockApi.createCollection(data)
    return apiClient.post<Collection>("/collections", data)
  },

  async updateCollection(id: string, data: Partial<Collection>): Promise<ApiResponse<Collection>> {
    if (USE_MOCK) return collectionMockApi.updateCollection(id, data)
    return apiClient.put<Collection>(`/collections/${id}`, data)
  },

  async deleteCollection(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK) return collectionMockApi.deleteCollection(id)
    return apiClient.delete<null>(`/collections/${id}`)
  },

  async uploadCoverImage(file: File): Promise<ApiResponse<{ url: string; publicId: string }>> {
    const formData = new FormData()
    formData.append("image", file)
    return apiClient.post<{ url: string; publicId: string }>('/uploads/image', formData)
  },

  async previewCollection(id: string, data?: { conditions: CollectionCondition[]; matchType: "all" | "any" }): Promise<ApiResponse<{ products: Product[]; count: number }>> {
    if (USE_MOCK) return collectionMockApi.previewCollection(id, data)
    return apiClient.post<{ products: Product[]; count: number }>(`/collections/${id}/preview`, data)
  },
}
