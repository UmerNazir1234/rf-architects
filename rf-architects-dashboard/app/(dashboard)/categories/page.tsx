"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { categoryService } from "@/services/category.service"
import { useToast } from "@/hooks/use-toast"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState("")
  const [order, setOrder] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editOrder, setEditOrder] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadCategories = async () => {
      const response = await categoryService.getCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      }
    }

    loadCategories()
  }, [])

  const refreshCategories = async () => {
    const response = await categoryService.getCategories()
    if (response.success && response.data) {
      setCategories(response.data)
    }
  }

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await categoryService.createCategory({ name, order: Number(order) || undefined })
    if (response.success && response.data) {
      setName("")
      setOrder("")
      toast({ title: "Category created" })
      await refreshCategories()
    } else {
      toast({ title: "Unable to create category", variant: "destructive" })
    }
  }

  const handleUpdate = async (id: string) => {
    setLoadingId(id)
    const response = await categoryService.updateCategory(id, {
      name: editName,
      order: Number(editOrder) || undefined,
    })
    setLoadingId(null)

    if (response.success && response.data) {
      toast({ title: "Category updated" })
      setEditingId(null)
      await refreshCategories()
    } else {
      toast({ title: response.message || "Unable to update category", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setLoadingId(deleteId)
    const response = await categoryService.deleteCategory(deleteId)
    setLoadingId(null)

    if (response.success) {
      toast({ title: "Category deleted" })
      setDeleteId(null)
      await refreshCategories()
    } else {
      toast({ title: response.message || "Unable to delete category", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Manage product categories and ordering</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-3">
            <Input placeholder="Category name" value={name} onChange={(event) => setName(event.target.value)} />
            <Input placeholder="Order" type="number" value={order} onChange={(event) => setOrder(event.target.value)} />
            <Button type="submit" className="min-w-[160px]">Create</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>Order #{category.order}</CardDescription>
                </div>
                <Badge variant="secondary">#{category.order}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {editingId === category.id ? (
                <div className="space-y-3">
                  <Input value={editName} onChange={(event) => setEditName(event.target.value)} placeholder="Category name" />
                  <Input value={editOrder} type="number" onChange={(event) => setEditOrder(event.target.value)} placeholder="Order" />
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(category.id)} disabled={loadingId === category.id}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => {
                    setEditingId(category.id)
                    setEditName(category.name)
                    setEditOrder(String(category.order))
                  }} size="sm">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(category.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Category?</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting this category will remove it from the mock database. This action cannot be undone.
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
