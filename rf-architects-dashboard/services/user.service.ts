import { userMockApi } from "./mock/user.mock"
import { apiClient } from "./api/client"
import type { User } from "@/models/index"
import type { ApiResponse, PaginatedResponse } from "@/models/common.model"

const USE_MOCK = false

export const userService = {
  async getUsers(): Promise<ApiResponse<PaginatedResponse<User>>> {
    if (USE_MOCK) return userMockApi.getUsers()
    return apiClient.get<PaginatedResponse<User>>("/users")
  },

  async createUser(data: Partial<User>): Promise<ApiResponse<User>> {
    if (USE_MOCK) return userMockApi.createUser(data)
    return apiClient.post<User>("/users", data)
  },

  async updateUserRole(id: string, role: string): Promise<ApiResponse<User>> {
    if (USE_MOCK) return userMockApi.updateUserRole(id, role)
    return apiClient.put<User>(`/users/${id}`, { role })
  },

  async toggleUserActive(id: string, isActive: boolean): Promise<ApiResponse<User>> {
    if (USE_MOCK) return userMockApi.toggleUserActive(id, isActive)
    return apiClient.put<User>(`/users/${id}`, { isActive })
  },

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK) return userMockApi.deleteUser(id)
    return apiClient.delete<null>(`/users/${id}`)
  },
}
