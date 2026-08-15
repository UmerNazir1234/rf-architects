"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { collectionService } from "@/services/collection.service"
import { categoryService } from "@/services/category.service"
import { productService } from "@/services/product.service"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Layers, Eye, RefreshCw } from "lucide-react"
import type { Collection, CollectionCondition, Category } from "@/models/index"
import type { Product } from "@/models/product.model"

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])

  // Form state
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [type, setType] = useState<"manual" | "automated">("manual")
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [conditions, setConditions] = useState<CollectionCondition[]>([
    { field: "category", operator: "equals", value: "" },
  ])
  const [matchType, setMatchType] = useState<"all" | "any">("all")

  // Editing & deletion state
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false)
  const [previewProducts, setPreviewProducts] = useState<Product[]>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const { toast } = useToast()

  const refreshCollections = async () => {
    const response = await collectionService.getCollections()
    if (response.success && response.data) {
      const list = Array.isArray(response.data)
        ? response.data
        : (response.data as any).collections || (response.data as any).items || []
      setCollections(list)
    }
  }

  useEffect(() => {
    const loadInit = async () => {
      setLoading(true)
      const [colRes, catRes, prodRes] = await Promise.all([
        collectionService.getCollections(),
        categoryService.getCategories(),
        productService.getProducts({ limit: 100 }),
      ])
      if (colRes.success && colRes.data) {
        const list = Array.isArray(colRes.data)
          ? colRes.data
          : (colRes.data as any).collections || (colRes.data as any).items || []
        setCollections(list)
      }
      if (catRes.success && catRes.data) setCategories(catRes.data)
      if (prodRes.success && prodRes.data) {
        const list = Array.isArray(prodRes.data)
          ? prodRes.data
          : (prodRes.data as any).products || (prodRes.data as any).items || []
        setAllProducts(list)
      }
      setLoading(false)
    }
    loadInit()
  }, [])

  const resetForm = () => {
    setName("")
    setSlug("")
    setCategory("")
    setDescription("")
    setCoverImage("")
    setType("manual")
    setSelectedProductIds([])
    setConditions([{ field: "category", operator: "equals", value: "" }])
    setMatchType("all")
    setEditingCollection(null)
  }

  const handleEdit = (col: Collection) => {
    setEditingCollection(col)
    setName(col.name)
    setSlug(col.slug)

    const normalizedCategoryId = typeof col.category === "string"
      ? categories.find((cat) => cat.id === col.category || cat.name === col.category)?.id || col.category
      : (col.category as any)?.id || ""

    setCategory(normalizedCategoryId)
    setDescription(col.description || "")
    setCoverImage(col.coverImage || "")
    setType(col.type || "manual")
    setSelectedProductIds(col.productIds || [])
    setConditions(col.conditions?.length ? col.conditions : [{ field: "category", operator: "equals", value: "" }])
    setMatchType(col.matchType || "all")
  }

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCoverImage(true)
    try {
      const response = await collectionService.uploadCoverImage(file)
      if (response.success && response.data?.url) {
        setCoverImage(response.data.url)
        toast({ title: "Cover image uploaded" })
      } else {
        toast({ title: response.message || "Unable to upload cover image", variant: "destructive" })
      }
    } catch {
      toast({ title: "Unable to upload cover image", variant: "destructive" })
    } finally {
      setUploadingCoverImage(false)
      e.target.value = ""
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !category) {
      toast({ title: "Name and Category are required", variant: "destructive" })
      return
    }

    const payload: Partial<Collection> = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      category,
      description,
      coverImage,
      type,
      productIds: type === "manual" ? selectedProductIds : [],
      conditions: type === "automated" ? conditions : [],
      matchType: type === "automated" ? matchType : "all",
    }

    let response
    if (editingCollection) {
      response = await collectionService.updateCollection(editingCollection.id, payload)
    } else {
      response = await collectionService.createCollection(payload)
    }

    if (response.success) {
      toast({ title: editingCollection ? "Collection updated" : "Collection created" })
      resetForm()
      await refreshCollections()
    } else {
      toast({ title: response.message || "Failed to save collection", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const response = await collectionService.deleteCollection(deleteId)
    if (response.success) {
      toast({ title: "Collection deleted" })
      setDeleteId(null)
      await refreshCollections()
    } else {
      toast({ title: response.message || "Unable to delete collection", variant: "destructive" })
    }
  }

  const handlePreview = async () => {
    if (editingCollection) {
      const res = await collectionService.previewCollection(editingCollection.id, { conditions, matchType })
      if (res.success && res.data) {
        setPreviewProducts(res.data.products)
        setIsPreviewOpen(true)
      }
    } else {
      // Offline local preview match
      setPreviewProducts(allProducts)
      setIsPreviewOpen(true)
    }
  }

  const addCondition = () => {
    setConditions([...conditions, { field: "category", operator: "equals", value: "" }])
  }

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const updateCondition = (index: number, key: keyof CollectionCondition, val: string) => {
    const updated = [...conditions]
    updated[index] = { ...updated[index], [key]: val }
    setConditions(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground">Manage product collections and automated rule sets</p>
        </div>
        {editingCollection && (
          <Button variant="outline" onClick={resetForm}>
            Cancel Editing
          </Button>
        )}
      </div>

      {/* Collection Form (Create / Edit) */}
      <Card>
        <CardHeader>
          <CardTitle>{editingCollection ? `Edit Collection: ${editingCollection.name}` : "Create Collection"}</CardTitle>
          <CardDescription>Configure basic details and manual/automated product inclusion rules</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Coffee Tables" />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input className="mt-1" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="coffee-tables" />
              </div>
              <div>
                <label className="text-sm font-medium">Parent Category *</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <Input
                  className="mt-1"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  disabled={uploadingCoverImage}
                />
                <p className="text-xs text-muted-foreground">{uploadingCoverImage ? "Uploading cover image..." : "Upload a cover image to store it in Cloudinary and display it on the front end."}</p>
                {coverImage && (
                  <div className="mt-2 overflow-hidden rounded-md border bg-muted/20">
                    <img src={coverImage} alt="Collection cover preview" className="h-28 w-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief collection summary..." />
              </div>
            </div>

            {/* Type selector: Manual vs Automated */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-semibold">Collection Type</label>
              <Tabs value={type} onValueChange={(val) => setType(val as "manual" | "automated")}>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="manual">Manual (Product Picker)</TabsTrigger>
                  <TabsTrigger value="automated">Automated (Condition Rules)</TabsTrigger>
                </TabsList>

                {/* Manual Tab: Product Picker */}
                <TabsContent value="manual" className="space-y-3 pt-3">
                  <p className="text-xs text-muted-foreground">Select products to include in this collection:</p>
                  <div className="max-h-48 overflow-y-auto rounded-md border p-3 space-y-2">
                    {allProducts.map((p) => {
                      const isSelected = selectedProductIds.includes(p.id)
                      return (
                        <label key={p.id} className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/50 p-1.5 rounded">
                          <span className="font-medium">{p.name} <span className="text-xs text-muted-foreground">({p.sku || p.slug})</span></span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedProductIds([...selectedProductIds, p.id])
                              else setSelectedProductIds(selectedProductIds.filter((id) => id !== p.id))
                            }}
                            className="h-4 w-4 rounded"
                          />
                        </label>
                      )
                    })}
                  </div>
                </TabsContent>

                {/* Automated Tab: Rule Builder */}
                <TabsContent value="automated" className="space-y-4 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Match:</span>
                      <Select value={matchType} onValueChange={(v) => setMatchType(v as "all" | "any")}>
                        <SelectTrigger className="h-8 w-28 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All conditions (AND)</SelectItem>
                          <SelectItem value="any">Any condition (OR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                        <Plus className="mr-1 h-3 w-3" /> Add Condition
                      </Button>
                      <Button type="button" variant="secondary" size="sm" onClick={handlePreview}>
                        <Eye className="mr-1 h-3 w-3" /> Dry-Run Preview
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {conditions.map((cond, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Select value={cond.field} onValueChange={(v) => updateCondition(idx, "field", v as any)}>
                          <SelectTrigger className="w-36 h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="price">Price</SelectItem>
                            <SelectItem value="inStock">Stock Status</SelectItem>
                            <SelectItem value="name">Product Name</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={cond.operator} onValueChange={(v) => updateCondition(idx, "operator", v as any)}>
                          <SelectTrigger className="w-36 h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="not_equals">Does not equal</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="greater_than">Greater than</SelectItem>
                            <SelectItem value="less_than">Less than</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input
                          className="flex-1 h-9 text-xs"
                          value={cond.value}
                          onChange={(e) => updateCondition(idx, "value", e.target.value)}
                          placeholder="Target value..."
                        />

                        {conditions.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => removeCondition(idx)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit">{editingCollection ? "Save Changes" : "Create Collection"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Collections Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {collections.map((col) => {
          const categoryObj = categories.find((c) => c.id === (typeof col.category === "string" ? col.category : (col.category as any)?.id))
          return (
            <Card key={col.id} className="relative flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{col.name}</CardTitle>
                    <CardDescription className="text-xs">{col.description || "No description"}</CardDescription>
                  </div>
                  <Badge variant={col.type === "automated" ? "secondary" : "outline"}>
                    {col.type === "automated" ? "Automated" : "Manual"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Category: <strong className="text-foreground">{categoryObj?.name || (col.category as any)?.name || "General"}</strong></span>
                  <span>Products: <strong className="text-foreground">{col.productCount || col.productIds?.length || 0}</strong></span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(col)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => setDeleteId(col.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the collection.
          </AlertDialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Automated Dry-Run Preview Dialog */}
      <AlertDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <AlertDialogContent className="max-w-xl">
          <AlertDialogTitle>Automated Dry-Run Preview</AlertDialogTitle>
          <AlertDialogDescription>
            {previewProducts.length} product(s) match the specified condition rules:
          </AlertDialogDescription>
          <div className="max-h-60 overflow-y-auto space-y-2 py-2">
            {previewProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs p-2 border rounded">
                <span className="font-medium">{p.name}</span>
                <span className="text-muted-foreground">Rs. {p.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsPreviewOpen(false)}>Close Preview</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
