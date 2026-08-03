import { apiClient } from "./api/client"
import { navMenuMockApi } from "./mock/navMenu.mock"
import type { NavMenu, NavMenuItem } from "@/models/index"
import type { ApiResponse } from "@/models/common.model"

const USE_MOCK = false

export const navMenuService = {
  async getNavMenu(handle = "main-navbar"): Promise<ApiResponse<{ menu: NavMenu; items: NavMenuItem[] }>> {
    if (USE_MOCK) return navMenuMockApi.getNavMenu(handle)
    return apiClient.get<{ menu: NavMenu; items: NavMenuItem[] }>(`/nav-menus/${handle}`)
  },

  async getAdminNavMenu(handle = "main-navbar"): Promise<ApiResponse<{ menu: NavMenu; items: NavMenuItem[] }>> {
    if (USE_MOCK) return navMenuMockApi.getAdminNavMenu(handle)
    return apiClient.get<{ menu: NavMenu; items: NavMenuItem[] }>(`/nav-menus/${handle}/admin`)
  },

  async createNavItem(handle: string, data: Partial<NavMenuItem>): Promise<ApiResponse<NavMenuItem>> {
    if (USE_MOCK) return navMenuMockApi.createNavItem(handle, data)
    return apiClient.post<NavMenuItem>(`/nav-menus/${handle}/items`, data)
  },

  async updateNavItem(handle: string, id: string, data: Partial<NavMenuItem>): Promise<ApiResponse<NavMenuItem>> {
    if (USE_MOCK) return navMenuMockApi.updateNavItem(handle, id, data)
    return apiClient.put<NavMenuItem>(`/nav-menus/${handle}/items/${id}`, data)
  },

  async reorderNavItems(handle: string, items: { id: string; order: number; parentId?: string | null }[]): Promise<ApiResponse<null>> {
    if (USE_MOCK) return navMenuMockApi.reorderNavItems(handle, items)
    return apiClient.patch<null>(`/nav-menus/${handle}/items/reorder`, { items })
  },

  async deleteNavItem(handle: string, id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK) return navMenuMockApi.deleteNavItem(handle, id)
    return apiClient.delete<null>(`/nav-menus/${handle}/items/${id}`)
  },
}
