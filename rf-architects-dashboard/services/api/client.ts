import type { ApiResponse } from "@/models/common.model"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api/v1"

export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  headers?: Record<string, string>
  body?: unknown
}

interface ApiEnvelope<T> {
  success?: boolean
  statusCode?: number
  data?: T
  message?: string
}

function normalizeIds<T>(value: T): T {
  if (!value || typeof value !== "object") {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeIds(entry)) as T
  }

  const result = Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, entry]) => {
    acc[key] = normalizeIds(entry)
    return acc
  }, {})

  if (typeof result._id === "string" && typeof result.id !== "string") {
    result.id = result._id
  }

  return result as T
}

function unwrapResponseBody<T>(body: unknown): ApiResponse<T> {
  if (!body || typeof body !== "object") {
    return { success: true, data: body as T }
  }

  const envelope = body as ApiEnvelope<T>

  if (typeof envelope.success === "boolean" || typeof envelope.statusCode === "number") {
    const normalizedData = normalizeIds(envelope.data)
    return {
      success: envelope.success ?? (typeof envelope.statusCode === "number" ? envelope.statusCode < 400 : true),
      data: normalizedData,
      message: envelope.message,
    }
  }

  return {
    success: true,
    data: normalizeIds(body as T),
  }
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    path: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`
    const method = config.method || "GET"
    const isFormData = config.body instanceof FormData

    const headers: Record<string, string> = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...config.headers,
    }

    const fetchConfig: RequestInit = {
      method,
      headers,
      credentials: "include",
    }

    if (config.body !== undefined) {
      fetchConfig.body = isFormData ? config.body : JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, fetchConfig)
      const rawText = await response.text()
      const body = rawText ? JSON.parse(rawText) : null
      const normalized = unwrapResponseBody<T>(body)

      if (!response.ok && !normalized.success) {
        console.error("API request failed:", path, normalized.message)
      }

      return normalized
    } catch (error) {
      console.error("API network error:", path, error)
      return {
        success: false,
        message: "Network error",
      }
    }
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<ApiResponse<T>> {
    const queryString = params
      ? new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)])).toString()
      : ""
    const fullPath = queryString ? `${path}?${queryString}` : path
    return this.request<T>(fullPath, { method: "GET" })
  }

  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "POST", body })
  }

  async put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "PUT", body })
  }

  async patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "PATCH", body })
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
