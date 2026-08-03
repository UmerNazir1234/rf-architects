import { mockDb } from "./db"
import type { SiteStat } from "@/models/index"
import type { ApiResponse } from "@/models/common.model"
import { randomDelay } from "@/lib/delay"

export const siteStatMockApi = {
  async getSiteStats(): Promise<ApiResponse<SiteStat[]>> {
    await randomDelay()
    return {
      success: true,
      data: [...mockDb.siteStats],
    }
  },

  async updateSiteStat(id: string, value: number): Promise<ApiResponse<SiteStat>> {
    await randomDelay()
    const stat = mockDb.siteStats.find((s) => s.id === id)
    if (!stat) {
      return { success: false, message: "Site stat not found" }
    }
    stat.value = value
    return { success: true, data: stat }
  },
}
