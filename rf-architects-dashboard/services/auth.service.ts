import { apiClient } from "./api/client"
import type { ApiResponse } from "@/models/common.model"

const USE_MOCK = true

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    if (USE_MOCK) {
      // Mock: Always succeed for demo credentials
      if (credentials.email === "demo@rfarchitects.design" && credentials.password === "demo123") {
        return {
          success: true,
          data: {
            token: "mock-token-" + Date.now(),
            user: {
              id: "user-1",
              email: credentials.email,
              name: "Admin User",
            },
          },
        }
      }
      return { success: false, message: "Invalid credentials. Try demo@rfarchitects.design / demo123" }
    }
    return apiClient.post<AuthResponse>("/auth/login", credentials)
  },

  async logout(): Promise<ApiResponse<null>> {
    if (USE_MOCK) {
      return { success: true, data: null }
    }
    return apiClient.post<null>("/auth/logout")
  },
}
