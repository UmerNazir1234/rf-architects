import { siteStatMockApi } from "./mock/siteStat.mock"
import { apiClient } from "./api/client"
import type { SiteStat } from "@/models/index"
import type { ApiResponse } from "@/models/common.model"

const USE_MOCK = true

export const siteStatService = {
  async getSiteStats(): Promise<ApiResponse<SiteStat[]>> {
    if (USE_MOCK) return siteStatMockApi.getSiteStats()
    return apiClient.get<SiteStat[]>("/site-stats")
  },

  async updateSiteStat(id: string, value: number): Promise<ApiResponse<SiteStat>> {
    if (USE_MOCK) return siteStatMockApi.updateSiteStat(id, value)
    return apiClient.patch<SiteStat>(`/site-stats/${id}`, { value })
  },
}
