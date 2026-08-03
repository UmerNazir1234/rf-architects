"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, X } from "lucide-react"
import { projectService } from "@/services/project.service"
import { apiClient } from "@/services/api/client"
import { useToast } from "@/hooks/use-toast"
import type { ProjectFormValues } from "@/models/index"

interface ProjectFormProps {
  initialValues?: Partial<ProjectFormValues>
  projectId?: string
}

const emptyValues: ProjectFormValues = {
  title: "",
  slug: "",
  location: "",
  year: new Date().getFullYear(),
  category: "Interior Design",
  concept_label: "The Concept",
  concept_subheading: "",
  description: "",
  cover_image: "",
  gallery_images: [],
  isFeatured: false,
  isPublished: false,
}

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

export function ProjectForm({ initialValues, projectId }: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>({ ...emptyValues, ...initialValues })
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialValues?.slug)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleTitleChange = (title: string) => {
    setValues((prev) => ({
      ...prev,
      title,
      slug: slugManuallyEdited ? prev.slug : slugify(title),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      if (isCover) {
        const formData = new FormData()
        formData.append("image", files[0])
        const res = await apiClient.post<{ url: string }>("/uploads/image", formData)
        if (res.success && res.data) {
          setValues((prev) => ({ ...prev, cover_image: (res.data as any).url }))
        } else {
          toast({ title: "Failed to upload cover image", variant: "destructive" })
        }
      } else {
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
          formData.append("images", files[i])
        }
        const res = await apiClient.post<any[]>("/uploads/images", formData)
        if (res.success && Array.isArray(res.data)) {
          const newUrls = res.data.map(img => img.url)
          setValues((prev) => ({
            ...prev,
            gallery_images: [...(prev.gallery_images || []), ...newUrls],
          }))
        } else {
          toast({ title: "Failed to upload gallery images", variant: "destructive" })
        }
      }
    } catch (err) {
      toast({ title: "Upload error", variant: "destructive" })
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    let response
    if (projectId) {
      response = await projectService.updateProject(projectId, values)
    } else {
      response = await projectService.createProject(values)
    }

    setSaving(false)

    if (response.success) {
      toast({ title: `Project ${projectId ? "updated" : "created"}` })
      router.push("/projects")
    } else {
      toast({ title: response.message || "Failed to save project", variant: "destructive" })
    }
  }

  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const newGallery = [...(values.gallery_images || [])]
    if (direction === 'up' && index > 0) {
      const temp = newGallery[index - 1]
      newGallery[index - 1] = newGallery[index]
      newGallery[index] = temp
    } else if (direction === 'down' && index < newGallery.length - 1) {
      const temp = newGallery[index + 1]
      newGallery[index + 1] = newGallery[index]
      newGallery[index] = temp
    }
    setValues({ ...values, gallery_images: newGallery })
  }

  const removeGalleryImage = (index: number) => {
    const newGallery = [...(values.gallery_images || [])]
    newGallery.splice(index, 1)
    setValues({ ...values, gallery_images: newGallery })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{projectId ? "Edit Project" : "New Project"}</h2>
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "Saving..." : "Save Project"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input required value={values.title} onChange={(e) => handleTitleChange(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  required
                  value={values.slug}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, slug: e.target.value }))
                    setSlugManuallyEdited(true)
                  }}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input required value={values.location} onChange={(e) => setValues((prev) => ({ ...prev, location: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input type="number" required value={values.year} onChange={(e) => setValues((prev) => ({ ...prev, year: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input required value={values.category} onChange={(e) => setValues((prev) => ({ ...prev, category: e.target.value }))} />
                <p className="text-xs text-muted-foreground">e.g., Interior Design, Residential, Commercial</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Concept Label</Label>
                <Input value={values.concept_label} onChange={(e) => setValues((prev) => ({ ...prev, concept_label: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Concept Subheading</Label>
                <Input value={values.concept_subheading || ""} onChange={(e) => setValues((prev) => ({ ...prev, concept_subheading: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea required rows={6} value={values.description} onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload multiple images</Label>
                <div className="flex items-center gap-4">
                  <Input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, false)} disabled={uploading} />
                </div>
              </div>

              {values.gallery_images && values.gallery_images.length > 0 && (
                <div className="space-y-2 mt-4">
                  {values.gallery_images.map((url, i) => (
                    <div key={i} className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex items-center gap-3">
                        <img src={url} alt="gallery" className="w-16 h-16 object-cover rounded" />
                        <span className="text-xs truncate max-w-[200px]">{url}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" disabled={i === 0} onClick={() => moveGalleryImage(i, 'up')}>↑</Button>
                        <Button type="button" variant="ghost" size="icon" disabled={i === (values.gallery_images?.length ?? 0) - 1} onClick={() => moveGalleryImage(i, 'down')}>↓</Button>
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeGalleryImage(i)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Published</Label>
                <Switch
                  checked={values.isPublished}
                  onCheckedChange={(v) => setValues((prev) => ({ ...prev, isPublished: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured</Label>
                <Switch
                  checked={values.isFeatured}
                  onCheckedChange={(v) => setValues((prev) => ({ ...prev, isFeatured: v }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {values.cover_image && (
                <div className="relative group rounded-md overflow-hidden border">
                  <img src={values.cover_image} alt="Cover" className="w-full h-auto aspect-video object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setValues((prev) => ({ ...prev, cover_image: "" }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {!values.cover_image && (
                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} disabled={uploading} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
