"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectForm } from "@/components/dashboard/ProjectForm"
import { projectService } from "@/services/project.service"
import type { ProjectFormValues } from "@/models/index"

export default function EditProjectPage() {
  const params = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<Partial<ProjectFormValues> | null>(null)

  useEffect(() => {
    const loadProject = async () => {
      if (!params?.id) return
      const response = await projectService.getProjectById(params.id)
      if (response.success && response.data) {
        setProject(response.data)
      }
      setLoading(false)
    }

    loadProject()
  }, [params?.id])

  if (loading) {
    return <p className="text-muted-foreground">Loading project…</p>
  }

  if (!project) {
    return <p className="text-destructive">Project not found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/projects">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">Update the project information.</p>
        </div>
      </div>
      
      <ProjectForm initialValues={project} projectId={params?.id} />
    </div>
  )
}
