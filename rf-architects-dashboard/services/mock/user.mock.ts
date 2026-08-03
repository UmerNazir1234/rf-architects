import { mockDb } from "./db"
import type { User } from "@/models/index"
import type { ApiResponse, PaginatedResponse } from "@/models/common.model"
import { randomDelay } from "@/lib/delay"

const generateId = () => `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const userMockApi = {
  async getUsers(): Promise<ApiResponse<PaginatedResponse<User>>> {
    await randomDelay()
    const users = [...mockDb.users]
    return {
      success: true,
      data: {
        items: users,
        page: 1,
        totalPages: 1,
        totalResults: users.length,
      },
    }
  },

  async createUser(data: Partial<User>): Promise<ApiResponse<User>> {
    await randomDelay()
    const newUser: User = {
      id: generateId(),
      name: data.name || "",
      email: data.email || "",
      role: data.role || "viewer",
      isActive: true,
      createdAt: new Date(),
    }
    mockDb.users.push(newUser)
    return { success: true, data: newUser }
  },

  async updateUserRole(id: string, role: string): Promise<ApiResponse<User>> {
    await randomDelay()
    const user = mockDb.users.find((u) => u.id === id)
    if (!user) {
      return { success: false, message: "User not found" }
    }
    user.role = role as any
    return { success: true, data: user }
  },

  async toggleUserActive(id: string, isActive: boolean): Promise<ApiResponse<User>> {
    await randomDelay()
    const user = mockDb.users.find((u) => u.id === id)
    if (!user) {
      return { success: false, message: "User not found" }
    }
    user.isActive = isActive
    return { success: true, data: user }
  },

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    await randomDelay()
    const index = mockDb.users.findIndex((u) => u.id === id)
    if (index === -1) {
      return { success: false, message: "User not found" }
    }
    mockDb.users.splice(index, 1)
    return { success: true, data: null }
  },
}
