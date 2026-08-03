import { mockDb } from "./db"
import type { NavMenu, NavMenuItem } from "@/models/index"
import type { ApiResponse } from "@/models/common.model"
import { randomDelay } from "@/lib/delay"

const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

function buildTree(items: NavMenuItem[]): NavMenuItem[] {
  const map: Record<string, NavMenuItem> = {}
  items.forEach((i) => { map[i.id] = { ...i, children: [] } })
  const roots: NavMenuItem[] = []
  items.forEach((i) => {
    const node = map[i.id]
    if (i.parentId && map[i.parentId]) {
      map[i.parentId].children!.push(node)
    } else {
      roots.push(node)
    }
  })
  const sortRecursive = (list: NavMenuItem[]) => {
    list.sort((a, b) => a.order - b.order)
    list.forEach((n) => n.children && sortRecursive(n.children))
  }
  sortRecursive(roots)
  return roots
}

export const navMenuMockApi = {
  async getNavMenu(handle: string): Promise<ApiResponse<{ menu: NavMenu; items: NavMenuItem[] }>> {
    await randomDelay()
    const menu = mockDb.navMenus.find((m) => m.handle === handle)
    if (!menu) return { success: false, message: "Menu not found" }
    const items = mockDb.navMenuItems.filter((i) => i.menuId === menu.id && i.isActive)
    return { success: true, data: { menu, items: buildTree(items) } }
  },

  async getAdminNavMenu(handle: string): Promise<ApiResponse<{ menu: NavMenu; items: NavMenuItem[] }>> {
    await randomDelay()
    const menu = mockDb.navMenus.find((m) => m.handle === handle)
    if (!menu) return { success: false, message: "Menu not found" }
    const items = mockDb.navMenuItems.filter((i) => i.menuId === menu.id)
    return { success: true, data: { menu, items: buildTree(items) } }
  },

  async createNavItem(handle: string, data: Partial<NavMenuItem>): Promise<ApiResponse<NavMenuItem>> {
    await randomDelay()
    const menu = mockDb.navMenus.find((m) => m.handle === handle)
    if (!menu) return { success: false, message: "Menu not found" }
    const newItem: NavMenuItem = {
      id: generateId(),
      menuId: menu.id,
      label: data.label || "New Item",
      linkType: data.linkType || "none",
      targetCollection: data.targetCollection || null,
      targetCategory: data.targetCategory || null,
      targetUrl: data.targetUrl || null,
      href: data.href || "#",
      parentId: data.parentId || null,
      order: data.order ?? 99,
      isActive: data.isActive !== undefined ? data.isActive : true,
    }
    mockDb.navMenuItems.push(newItem)
    return { success: true, data: newItem }
  },

  async updateNavItem(handle: string, id: string, data: Partial<NavMenuItem>): Promise<ApiResponse<NavMenuItem>> {
    await randomDelay()
    const idx = mockDb.navMenuItems.findIndex((i) => i.id === id)
    if (idx === -1) return { success: false, message: "Item not found" }
    const updated = { ...mockDb.navMenuItems[idx], ...data }
    mockDb.navMenuItems[idx] = updated
    return { success: true, data: updated }
  },

  async reorderNavItems(handle: string, items: { id: string; order: number; parentId?: string | null }[]): Promise<ApiResponse<null>> {
    await randomDelay()
    items.forEach(({ id, order, parentId }) => {
      const item = mockDb.navMenuItems.find((i) => i.id === id)
      if (item) {
        item.order = order
        if (parentId !== undefined) item.parentId = parentId
      }
    })
    return { success: true, data: null }
  },

  async deleteNavItem(handle: string, id: string): Promise<ApiResponse<null>> {
    await randomDelay()
    // Cascade delete children
    mockDb.navMenuItems = mockDb.navMenuItems.filter((i) => i.id !== id && i.parentId !== id)
    return { success: true, data: null }
  },
}
