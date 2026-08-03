import { mockDb } from "./db"
import type { Settings } from "@/models/index"
import type { ApiResponse } from "@/models/common.model"
import { randomDelay } from "@/lib/delay"

export const settingsMockApi = {
  async getSettings(): Promise<ApiResponse<Settings>> {
    await randomDelay()
    return {
      success: true,
      data: mockDb.settings,
    }
  },

  async updateSettings(data: Partial<Settings>): Promise<ApiResponse<Settings>> {
    await randomDelay()
    const updated = { ...mockDb.settings, ...data, updatedAt: new Date() }
    mockDb.settings = updated
    return { success: true, data: updated }
  },
}
