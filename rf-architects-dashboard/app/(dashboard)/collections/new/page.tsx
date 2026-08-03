"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categoryService } from "@/services/category.service"
import { collectionService } from "@/services/collection.service"
import type { Category } from "@/models/index"

export default function NewCollectionPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      const response = await categoryService.getCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      }
    }

    loadCategories()
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    const response = await collectionService.createCollection({
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/collections">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Collection</h1>
          <p className="text-muted-foreground">Add a new collection to the catalog.</p>
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
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Create Collection"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
