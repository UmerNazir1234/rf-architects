"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { projectService } from "@/services/project.service"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Plus, ArrowUp, ArrowDown, Edit2, Trash2 } from "lucide-react"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const isViewer = user?.role === "viewer"

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    const response = await projectService.getProjects()
    if (response.success && response.data) {
      setProjects(response.data.items)
    }
  }

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    setLoadingId(id)
    const response = await projectService.toggleProjectPublish(id, isPublished)
    setLoadingId(null)
    if (response.success && response.data) {
      toast({ title: `Project ${isPublished ? "published" : "unpublished"}` })
      setProjects((prev) => prev.map((project) => (project.id === id ? response.data : project)))
    } else {
      toast({ title: response.message || "Unable to update project", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setLoadingId(deleteId)
    const response = await projectService.deleteProject(deleteId)
    setLoadingId(null)
    if (response.success) {
      toast({ title: "Project deleted" })
      setDeleteId(null)
      await loadProjects()
    } else {
      toast({ title: response.message || "Unable to delete project", variant: "destructive" })
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (isViewer) return

    const newProjects = [...projects]
    if (direction === 'up' && index > 0) {
      const temp = newProjects[index - 1]
      newProjects[index - 1] = newProjects[index]
      newProjects[index] = temp
    } else if (direction === 'down' && index < newProjects.length - 1) {
      const temp = newProjects[index + 1]
      newProjects[index + 1] = newProjects[index]
      newProjects[index] = temp
    } else {
      return
    }

    setProjects(newProjects)

    const ids = newProjects.map(p => p.id)
    const res = await projectService.reorderProjects(ids)
    if (res.success) {
      toast({ title: "Order updated" })
    } else {
      toast({ title: "Failed to update order", variant: "destructive" })
      loadProjects() // revert
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Showcase completed architecture and interior projects</p>
        </div>
        {!isViewer && (
          <Link href="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Card key={project.id} className="overflow-hidden flex flex-col">
            {project.cover_image && (
              <div className="h-48 overflow-hidden bg-muted">
                <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover" />
              </div>
            )}
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                  <CardDescription>{project.location} • {project.year}</CardDescription>
                  <div className="text-xs text-muted-foreground mt-1">{project.category}</div>
                </div>
                <Badge variant={project.isPublished ? "default" : "secondary"}>
                  {project.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 mt-auto">
              {!isViewer && (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(project.id, !project.isPublished)}
                      disabled={loadingId === project.id}
                    >
                      {project.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="outline" size="sm" title="Edit">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteId(project.id)} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button variant="secondary" size="icon" className="h-8 w-8" disabled={index === 0} onClick={() => handleMove(index, 'up')}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8" disabled={index === projects.length - 1} onClick={() => handleMove(index, 'down')}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
          No projects found. Create one to get started.
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Project?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the project from our servers.
          </AlertDialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
