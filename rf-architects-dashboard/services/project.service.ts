import { projectMockApi } from "./mock/project.mock"
import { apiClient } from "./api/client"
import type { Project, ProjectFormValues } from "@/models/index"
import type { ApiResponse, PaginatedResponse, ListParams } from "@/models/common.model"

const USE_MOCK = false

function normalizeProjectListResponse(
  response: ApiResponse<{ projects?: Project[]; items?: Project[]; pagination?: { total?: number; pages?: number; currentPage?: number } }>
): ApiResponse<PaginatedResponse<Project>> {
  if (!response.success || !response.data || Array.isArray(response.data)) {
    return response as ApiResponse<PaginatedResponse<Project>>
  }

  const { projects, items, pagination } = response.data
  const list = projects ?? items ?? []

  return {
    ...response,
    data: {
      items: list,
      page: pagination?.currentPage ?? 1,
      totalPages: pagination?.pages ?? 1,
      totalResults: pagination?.total ?? list.length,
    },
  }
}

export const projectService = {
  async getProjects(params?: ListParams): Promise<ApiResponse<PaginatedResponse<Project>>> {
    if (USE_MOCK) return projectMockApi.getProjects(params)
    const response = await apiClient.get<{ projects?: Project[]; items?: Project[]; pagination?: { total?: number; pages?: number; currentPage?: number } }>(
      "/projects/admin/list",
      params
    )
    return normalizeProjectListResponse(response)
  },

  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    if (USE_MOCK) return projectMockApi.getProjectById(id)
    return apiClient.get<Project>(`/projects/${id}`)
  },

  async createProject(data: ProjectFormValues): Promise<ApiResponse<Project>> {
    if (USE_MOCK) return projectMockApi.createProject(data)
    return apiClient.post<Project>("/projects", data)
  },

  async updateProject(id: string, data: Partial<ProjectFormValues>): Promise<ApiResponse<Project>> {
    if (USE_MOCK) return projectMockApi.updateProject(id, data)
    return apiClient.put<Project>(`/projects/${id}`, data)
  },

  async deleteProject(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK) return projectMockApi.deleteProject(id)
    return apiClient.delete<null>(`/projects/${id}`)
  },

  async toggleProjectPublish(id: string, isPublished: boolean): Promise<ApiResponse<Project>> {
    if (USE_MOCK) return projectMockApi.toggleProjectPublish(id, isPublished)
    return apiClient.patch<Project>(`/projects/${id}/publish`, { isPublished })
  },

  async reorderProjects(ids: string[]): Promise<ApiResponse<null>> {
    if (USE_MOCK) return projectMockApi.reorderProjects(ids)
    return apiClient.patch<null>("/projects/reorder", { order: ids })
  },
}
