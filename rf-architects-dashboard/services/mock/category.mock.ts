import { mockDb } from "./db"
import type { Category } from "@/models/index"
import type { ApiResponse } from "@/models/common.model"
import { randomDelay } from "@/lib/delay"

const generateId = () => `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const categoryMockApi = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    await randomDelay()
    return {
      success: true,
      data: [...mockDb.categories].sort((a, b) => a.order - b.order),
    }
  },

  async createCategory(data: Partial<Category>): Promise<ApiResponse<Category>> {
    await randomDelay()
    const maxOrder = Math.max(...mockDb.categories.map((c) => c.order), 0)
    const newCategory: Category = {
      id: generateId(),
      name: data.name || "",
      order: data.order || maxOrder + 1,
      createdAt: new Date(),
    }
    mockDb.categories.push(newCategory)
    return { success: true, data: newCategory }
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<ApiResponse<Category>> {
    await randomDelay()
    const index = mockDb.categories.findIndex((c) => c.id === id)
    if (index === -1) {
      return { success: false, message: "Category not found" }
    }
    const updated = { ...mockDb.categories[index], ...data }
    mockDb.categories[index] = updated
    return { success: true, data: updated }
  },

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    await randomDelay()
    const index = mockDb.categories.findIndex((c) => c.id === id)
    if (index === -1) {
      return { success: false, message: "Category not found" }
    }
    mockDb.categories.splice(index, 1)
    return { success: true, data: null }
  },

  async reorderCategories(ids: string[]): Promise<ApiResponse<null>> {
    await randomDelay()
    ids.forEach((id, index) => {
      const category = mockDb.categories.find((c) => c.id === id)
      if (category) {
        category.order = index
      }
    })
    return { success: true, data: null }
  },
}
