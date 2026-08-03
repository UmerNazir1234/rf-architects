"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categoryService } from "@/services/category.service"
import { collectionService } from "@/services/collection.service"
import type { Category } from "@/models/index"

export default function EditCollectionPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesResponse = await categoryService.getCategories()
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data)
      }
    }

    const loadCollection = async () => {
      if (!params?.id) return
      const response = await collectionService.getCollectionById(params.id)
      if (response.success && response.data) {
        setName(response.data.name)
        setSlug(response.data.slug)
        const normalizedCategoryId = typeof response.data.category === "string"
          ? categories.find((cat) => cat.id === response.data.category || cat.name === response.data.category)?.id || response.data.category
          : (response.data.category as any)?.id || ""
        setCategory(normalizedCategoryId)
        setDescription(response.data.description)
      }
      setLoading(false)
    }

    loadCategories()
    loadCollection()
  }, [params?.id])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!params?.id) return
    setSaving(true)
    const response = await collectionService.updateCollection(params.id, {
      name,
      slug,
      category,
      description,
    })
    setSaving(false)

    if (response.success) {
      router.push("/collections")
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading collection…</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/collections">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Collection</h1>
          <p className="text-muted-foreground">Update collection details.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
            <Input placeholder="Slug" value={slug} onChange={(event) => setSlug(event.target.value)} />
            <div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
