import { mockDb } from "./db"
import type { FAQ } from "@/models/index"
import type { ApiResponse } from "@/models/common.model"
import { randomDelay } from "@/lib/delay"

const generateId = () => `faq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const faqMockApi = {
  async getFAQs(published?: boolean): Promise<ApiResponse<FAQ[]>> {
    await randomDelay()
    let faqs = [...mockDb.faqs]

    if (published) {
      faqs = faqs.filter((f) => f.isPublished === true)
    }

    return {
      success: true,
      data: faqs.sort((a, b) => a.order - b.order),
    }
  },

  async createFAQ(data: Partial<FAQ>): Promise<ApiResponse<FAQ>> {
    await randomDelay()
    const maxOrder = Math.max(...mockDb.faqs.map((f) => f.order), 0)
    const newFAQ: FAQ = {
      id: generateId(),
      question: data.question || "",
      answer: data.answer || "",
      order: data.order || maxOrder + 1,
      isPublished: data.isPublished || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDb.faqs.push(newFAQ)
    return { success: true, data: newFAQ }
  },

  async updateFAQ(id: string, data: Partial<FAQ>): Promise<ApiResponse<FAQ>> {
    await randomDelay()
    const index = mockDb.faqs.findIndex((f) => f.id === id)
    if (index === -1) {
      return { success: false, message: "FAQ not found" }
    }
    const updated = { ...mockDb.faqs[index], ...data, updatedAt: new Date() }
    mockDb.faqs[index] = updated
    return { success: true, data: updated }
  },

  async deleteFAQ(id: string): Promise<ApiResponse<null>> {
    await randomDelay()
    const index = mockDb.faqs.findIndex((f) => f.id === id)
    if (index === -1) {
      return { success: false, message: "FAQ not found" }
    }
    mockDb.faqs.splice(index, 1)
    return { success: true, data: null }
  },

  async reorderFAQs(ids: string[]): Promise<ApiResponse<null>> {
    await randomDelay()
    ids.forEach((id, index) => {
      const faq = mockDb.faqs.find((f) => f.id === id)
      if (faq) {
        faq.order = index
      }
    })
    return { success: true, data: null }
  },
}
