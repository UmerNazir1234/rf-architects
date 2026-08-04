"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Plus, Trash2, Edit, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useProductController } from "@/controllers/useProductController"
import { categoryService } from "@/services/category.service"
import { collectionService } from "@/services/collection.service"
import type { Category, Collection } from "@/models/index"

export default function ProductsPage() {
  const { products, loading, getProducts, deleteProduct, togglePublish, bulkPublish, bulkDelete } = useProductController()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [collectionFilter, setCollectionFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [sort, setSort] = useState("newest")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])

  // Load dynamic category and collection options
  useEffect(() => {
    const loadFilters = async () => {
      const [catRes, colRes] = await Promise.all([
        categoryService.getCategories(),
        collectionService.getCollections(),
      ])
      if (catRes.success && catRes.data) setCategories(catRes.data)
      if (colRes.success && colRes.data) {
        const list = Array.isArray(colRes.data)
          ? colRes.data
          : (colRes.data as any).collections || (colRes.data as any).items || []
        setCollections(list)
      }
    }
    loadFilters()
  }, [])

  // Scoped collection list based on selected category filter
  const scopedCollections = useMemo(() => {
    const colls = collections || []
    if (categoryFilter === "all") return colls
    return colls.filter((c) => {
      const catId = typeof c.category === "string" ? c.category : (c.category as any)?.id
      return catId === categoryFilter
    })
  }, [categoryFilter, collections])

  useEffect(() => {
    getProducts({
      search,
      category: categoryFilter === "all" ? undefined : categoryFilter,
      collection: collectionFilter === "all" ? undefined : collectionFilter,
      inStock: stockFilter === "all" ? undefined : stockFilter === "instock",
      sort,
    })
  }, [search, categoryFilter, collectionFilter, stockFilter, sort])

  const handleCategoryChange = (value: string | null) => {
    setCategoryFilter(value ?? "all")
    setCollectionFilter("all")
  }

  const handleCollectionChange = (value: string | null) => {
    setCollectionFilter(value ?? "all")
  }

  const handleStockChange = (value: string | null) => {
    setStockFilter(value ?? "all")
  }

  const handleSortChange = (value: string | null) => {
    setSort(value ?? "newest")
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map((p) => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectProduct = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((pid) => pid !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Search</label>
              <Input
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Select
                value={categoryFilter}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Collection</label>
              <Select value={collectionFilter} onValueChange={handleCollectionChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Collections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collections</SelectItem>
                  {scopedCollections.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Stock Status</label>
              <Select value={stockFilter} onValueChange={handleStockChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Statuses</SelectItem>
                  <SelectItem value="instock">In Stock</SelectItem>
                  <SelectItem value="outofstock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Sort</label>
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      {selectedIds.length > 0 && (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <p className="text-sm text-muted-foreground">{selectedIds.length} item(s) selected</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => bulkPublish(selectedIds, true)}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Publish
              </Button>
              <Button variant="outline" size="sm" onClick={() => bulkPublish(selectedIds, false)}>
                <XCircle className="mr-2 h-4 w-4" /> Unpublish
              </Button>
              <Button variant="destructive" size="sm" onClick={() => bulkDelete(selectedIds)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products Catalog</CardTitle>
          <CardDescription>{products.length} product(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading products...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No products match the selected criteria</p>
              <Link href="/products/new">
                <Button className="mt-4">Create product</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === products.length && products.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name / Slug</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const featuredImg = product.images?.find((img) => img.isFeatured)?.url || product.images?.[0]?.url
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(product.id)}
                            onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          {featuredImg ? (
                            <img src={featuredImg} alt={product.name} className="h-10 w-10 rounded object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.slug}</div>
                        </TableCell>
                        <TableCell className="text-sm">{product.sku || "—"}</TableCell>
                        <TableCell className="font-medium">Rs. {product.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={product.inStock ? "default" : "secondary"}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.isActive ? "default" : "outline"}>
                            {product.isActive ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title={product.isActive ? "Unpublish" : "Publish"}
                              onClick={() => togglePublish(product.id, !product.isActive)}
                            >
                              {product.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            </Button>
                            <Link href={`/products/${product.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Product?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The product will be permanently deleted.
          </AlertDialogDescription>
          <div className="flex justify-end gap-4 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) {
                  deleteProduct(deleteId)
                  setDeleteId(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
