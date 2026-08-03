import { categoryMockApi } from "./mock/category.mock"
import { apiClient } from "./api/client"
import type { Category } from "@/models/index"
import type { ApiResponse } from "@/models/common.model"

const USE_MOCK = false

export const categoryService = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    if (USE_MOCK) return categoryMockApi.getCategories()
    return apiClient.get<Category[]>("/categories")
  },

  async createCategory(data: Partial<Category>): Promise<ApiResponse<Category>> {
    if (USE_MOCK) return categoryMockApi.createCategory(data)
    return apiClient.post<Category>("/categories", data)
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<ApiResponse<Category>> {
    if (USE_MOCK) return categoryMockApi.updateCategory(id, data)
    return apiClient.put<Category>(`/categories/${id}`, data)
  },

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK) return categoryMockApi.deleteCategory(id)
    return apiClient.delete<null>(`/categories/${id}`)
  },

  async reorderCategories(ids: string[]): Promise<ApiResponse<null>> {
    if (USE_MOCK) return categoryMockApi.reorderCategories(ids)
    const categoriesPayload = ids.map((id, index) => ({ _id: id, order: index }))
    return apiClient.patch<null>("/categories/reorder", { categories: categoriesPayload })
  },
}
