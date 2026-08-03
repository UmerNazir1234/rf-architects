import { productMockApi } from "./mock/product.mock"
import { apiClient } from "./api/client"
import type { Product, ProductFormValues, ProductImage } from "@/models/product.model"
import type { ApiResponse, PaginatedResponse, ListParams } from "@/models/common.model"

const USE_MOCK = false

export const productService = {
  async getProducts(params?: ListParams): Promise<ApiResponse<PaginatedResponse<Product>>> {
    if (USE_MOCK) return productMockApi.getProducts(params)
    return apiClient.get<PaginatedResponse<Product>>("/products/admin/list", params)
  },

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    if (USE_MOCK) return productMockApi.getProductById(id)
    return apiClient.get<Product>(`/products/admin/${id}`)
  },

  async createProduct(data: ProductFormValues): Promise<ApiResponse<Product>> {
    if (USE_MOCK) return productMockApi.createProduct(data)
    return apiClient.post<Product>("/products", data)
  },

  async updateProduct(id: string, data: Partial<ProductFormValues>): Promise<ApiResponse<Product>> {
    if (USE_MOCK) return productMockApi.updateProduct(id, data)
    return apiClient.put<Product>(`/products/${id}`, data)
  },

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK) return productMockApi.deleteProduct(id)
    return apiClient.delete<null>(`/products/${id}`)
  },

  async toggleProductPublish(id: string, isActive: boolean): Promise<ApiResponse<Product>> {
    if (USE_MOCK) return productMockApi.toggleProductPublish(id, isActive)
    return apiClient.patch<Product>(`/products/${id}/publish`, { isActive })
  },

  async bulkPublish(ids: string[], isActive: boolean): Promise<ApiResponse<null>> {
    if (USE_MOCK) return productMockApi.bulkPublish(ids, isActive)
    return apiClient.post<null>("/products/bulk", { ids, action: isActive ? "publish" : "unpublish" })
  },

  async bulkDelete(ids: string[]): Promise<ApiResponse<null>> {
    if (USE_MOCK) return productMockApi.bulkDelete(ids)
    return apiClient.post<null>("/products/bulk", { ids, action: "delete" })
  },

  async uploadImages(files: File[]): Promise<ApiResponse<ProductImage[]>> {
    const formData = new FormData()
    files.forEach((f) => formData.append("images", f))
    return apiClient.post<ProductImage[]>("/uploads/images", formData)
  },
}
