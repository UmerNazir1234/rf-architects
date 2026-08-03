"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categoryService } from "@/services/category.service"

export default function NewCategoryPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [order, setOrder] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    const response = await categoryService.createCategory({
      name,
      order: order ? Number(order) : undefined,
    })
    setSaving(false)

    if (response.success) {
      router.push("/categories")
    }
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
          <h1 className="text-3xl font-bold">Create Category</h1>
          <p className="text-muted-foreground">Add a new category to the product catalog.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Category name" value={name} onChange={(event) => setName(event.target.value)} />
            <Input placeholder="Order" type="number" value={order} onChange={(event) => setOrder(event.target.value)} />
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Create Category"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
