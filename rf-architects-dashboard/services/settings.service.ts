import { settingsMockApi } from "./mock/settings.mock"
import { apiClient } from "./api/client"
import type { Settings } from "@/models/index"
import type { ApiResponse } from "@/models/common.model"

const USE_MOCK = true

export const settingsService = {
  async getSettings(): Promise<ApiResponse<Settings>> {
    if (USE_MOCK) return settingsMockApi.getSettings()
    return apiClient.get<Settings>("/settings")
  },

  async updateSettings(data: Partial<Settings>): Promise<ApiResponse<Settings>> {
    if (USE_MOCK) return settingsMockApi.updateSettings(data)
    return apiClient.put<Settings>("/settings", data)
  },
}
