export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  totalPages: number
  totalResults: number
}

export interface ListParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
}

export enum UserRole {
  SUPERADMIN = "superadmin",
  EDITOR = "editor",
  VIEWER = "viewer",
}
