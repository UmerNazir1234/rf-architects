"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categoryService } from "@/services/category.service"

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [name, setName] = useState("")
  const [order, setOrder] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadCategory = async () => {
      if (!params?.id) return
      const response = await categoryService.getCategories()
      if (response.success && response.data) {
        const category = response.data.find((item) => item.id === params.id)
        if (category) {
          setName(category.name)
          setOrder(String(category.order))
        }
      }
      setLoading(false)
    }

    loadCategory()
  }, [params?.id])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!params?.id) return
    setSaving(true)
    const response = await categoryService.updateCategory(params.id, {
      name,
      order: order ? Number(order) : undefined,
    })
    setSaving(false)

    if (response.success) {
      router.push("/categories")
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading category…</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/categories">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Category</h1>
          <p className="text-muted-foreground">Update category settings.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Category name" value={name} onChange={(event) => setName(event.target.value)} />
            <Input placeholder="Order" type="number" value={order} onChange={(event) => setOrder(event.target.value)} />
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
