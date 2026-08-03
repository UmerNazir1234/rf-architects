import { mockDb } from "./db"
import type { Project, ProjectFormValues } from "@/models/index"
import type { ApiResponse, PaginatedResponse, ListParams } from "@/models/common.model"
import { randomDelay } from "@/lib/delay"

const generateId = () => `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const projectMockApi = {
  async getProjects(params?: ListParams): Promise<ApiResponse<PaginatedResponse<Project>>> {
    await randomDelay()
    let projects = [...mockDb.projects]

    if (params?.search) {
      const search = params.search.toLowerCase()
      projects = projects.filter((p) => p.title.toLowerCase().includes(search))
    }

    const page = params?.page || 1
    const limit = params?.limit || 10
    const start = (page - 1) * limit
    const paginatedProjects = projects.slice(start, start + limit)

    return {
      success: true,
      data: {
        items: paginatedProjects,
        page,
        totalPages: Math.ceil(projects.length / limit),
        totalResults: projects.length,
      },
    }
  },

  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    await randomDelay()
    const project = mockDb.projects.find((p) => p.id === id)
    if (!project) {
      return { success: false, message: "Project not found" }
    }
    return { success: true, data: project }
  },

  async createProject(data: ProjectFormValues): Promise<ApiResponse<Project>> {
    await randomDelay()
    const newProject: Project = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDb.projects.push(newProject)
    return { success: true, data: newProject }
  },

  async updateProject(id: string, data: Partial<ProjectFormValues>): Promise<ApiResponse<Project>> {
    await randomDelay()
    const index = mockDb.projects.findIndex((p) => p.id === id)
    if (index === -1) {
      return { success: false, message: "Project not found" }
    }
    const updated = { ...mockDb.projects[index], ...data, updatedAt: new Date() }
    mockDb.projects[index] = updated
    return { success: true, data: updated }
  },

  async deleteProject(id: string): Promise<ApiResponse<null>> {
    await randomDelay()
    const index = mockDb.projects.findIndex((p) => p.id === id)
    if (index === -1) {
      return { success: false, message: "Project not found" }
    }
    mockDb.projects.splice(index, 1)
    return { success: true, data: null }
  },

  async toggleProjectPublish(id: string, isPublished: boolean): Promise<ApiResponse<Project>> {
    await randomDelay()
    const project = mockDb.projects.find((p) => p.id === id)
    if (!project) {
      return { success: false, message: "Project not found" }
    }
    project.isPublished = isPublished
    project.updatedAt = new Date()
    return { success: true, data: project }
  },

  async reorderProjects(ids: string[]): Promise<ApiResponse<null>> {
    await randomDelay()
    // In a real scenario, you'd update a display_order field
    return { success: true, data: null }
  },
}
