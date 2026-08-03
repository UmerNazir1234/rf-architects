import { faqMockApi } from "./mock/faq.mock"
import { apiClient } from "./api/client"
import type { FAQ } from "@/models/index"
import type { ApiResponse } from "@/models/common.model"

const USE_MOCK = true

export const faqService = {
  async getFAQs(published?: boolean): Promise<ApiResponse<FAQ[]>> {
    if (USE_MOCK) return faqMockApi.getFAQs(published)
    return apiClient.get<FAQ[]>("/faqs", { published })
  },

  async createFAQ(data: Partial<FAQ>): Promise<ApiResponse<FAQ>> {
    if (USE_MOCK) return faqMockApi.createFAQ(data)
    return apiClient.post<FAQ>("/faqs", data)
  },

  async updateFAQ(id: string, data: Partial<FAQ>): Promise<ApiResponse<FAQ>> {
    if (USE_MOCK) return faqMockApi.updateFAQ(id, data)
    return apiClient.put<FAQ>(`/faqs/${id}`, data)
  },

  async deleteFAQ(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK) return faqMockApi.deleteFAQ(id)
    return apiClient.delete<null>(`/faqs/${id}`)
  },

  async reorderFAQs(ids: string[]): Promise<ApiResponse<null>> {
    if (USE_MOCK) return faqMockApi.reorderFAQs(ids)
    return apiClient.post<null>("/faqs/reorder", { ids })
  },
}
