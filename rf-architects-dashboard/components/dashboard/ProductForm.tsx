"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Star, GripVertical, Upload, X } from "lucide-react"
import type { ProductFormValues, ProductImage, ProductOption, ProductVariant } from "@/models/product.model"
import type { Category, Collection } from "@/models/index"
import { categoryService } from "@/services/category.service"
import { collectionService } from "@/services/collection.service"
import { productService } from "@/services/product.service"

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>
  submitLabel: string
  submitting?: boolean
  onSubmit: (values: ProductFormValues) => Promise<void> | void
}

const emptyValues: ProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  price: 0,
  compareAtPrice: null,
  category: "",
  collection: "",
  collections: [],
  images: [],
  description: "",
  productDetails: [],
  inStock: true,
  stockNote: "",
  hasVariants: false,
  options: [],
  variants: [],
  relatedProducts: [],
  isActive: true,
}

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

// Generate all variant combinations from options with per-value pricing
function generateVariantCombination(options: ProductOption[]): Record<string, string>[] {
  if (!options.length) return []
  const [first, ...rest] = options
  const restCombos = generateVariantCombination(rest)
  return first.options.flatMap((opt) =>
    restCombos.length
      ? restCombos.map((combo) => ({ [first.name]: opt.value, ...combo }))
      : [{ [first.name]: opt.value }]
  )
}

export function ProductForm({ initialValues, submitLabel, submitting = false, onSubmit }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({ ...emptyValues, ...initialValues })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [allCollections, setAllCollections] = useState<Collection[]>([])
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [relatedProductsText, setRelatedProductsText] = useState(
    initialValues?.relatedProducts?.join(", ") || ""
  )
  const [uploadingImages, setUploadingImages] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  // Load categories + collections
  useEffect(() => {
    const load = async () => {
      const [categoryRes, collectionRes] = await Promise.all([
        categoryService.getCategories(),
        collectionService.getCollections(),
      ])
      if (categoryRes.success && categoryRes.data) {
        setCategories(categoryRes.data)
      }

      if (collectionRes.success && collectionRes.data) {
        const list = Array.isArray(collectionRes.data)
          ? collectionRes.data
          : (collectionRes.data as any).collections || (collectionRes.data as any).items || []
        setAllCollections(list)
      }
    }
    load()
  }, [])

  // Sync initialValues on load
  useEffect(() => {
    if (initialValues) {
      const catId = typeof initialValues.category === "object" && initialValues.category
        ? (initialValues.category as any).id || (initialValues.category as any)._id || ""
        : (initialValues.category ?? "")

      const colId = typeof initialValues.collection === "object" && initialValues.collection
        ? (initialValues.collection as any).id || (initialValues.collection as any)._id || ""
        : (initialValues.collection ?? "")

      const collectionIds = Array.isArray(initialValues.collections)
        ? initialValues.collections.map((c) => (typeof c === "object" ? (c as any).id || (c as any)._id || "" : c)).filter(Boolean)
        : colId
        ? [colId]
        : []

      setValues((prev) => ({
        ...prev,
        ...initialValues,
        price: initialValues.price ?? 0,
        category: catId,
        collection: colId,
        collections: collectionIds,
        inStock: initialValues.inStock ?? true,
        isActive: initialValues.isActive ?? false,
        images: initialValues.images ?? [],
        productDetails: Array.isArray(initialValues.productDetails) ? initialValues.productDetails : [],
        hasVariants: initialValues.hasVariants ?? false,
        options: initialValues.options ?? [],
        variants: initialValues.variants ?? [],
      }))
      setRelatedProductsText(initialValues.relatedProducts?.join(", ") || "")
    }
  }, [initialValues])

  // Auto-slug
  useEffect(() => {
    if (!slugManuallyEdited) {
      setValues((prev) => ({ ...prev, slug: slugify(prev.name) }))
    }
  }, [values.name, slugManuallyEdited])

  // Scope collections to selected category
  const filteredCollections = useMemo(
    () => {
      let filtered = values.category
        ? allCollections.filter((c) => {
            const catId = typeof c.category === "string" ? c.category : (c.category as any)?.id
            return catId === values.category || (c.category as any)?.name === values.category
          })
        : allCollections

      const selectedCollectionIds = values.collections || []
      selectedCollectionIds.forEach((selectedId) => {
        const current = allCollections.find((c) => c.id === selectedId)
        if (current && !filtered.some((c) => c.id === selectedId)) {
          filtered = [...filtered, current]
        }
      })

      if (values.collection) {
        const current = allCollections.find((c) => c.id === values.collection)
        if (current && !filtered.some((c) => c.id === values.collection)) {
          filtered = [...filtered, current]
        }
      }

      return filtered
    },
    [values.category, values.collection, values.collections, allCollections]
  )

  // ─── Image handling ────────────────────────────────────────────────────────

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      setUploadingImages(true)
      setErrors((prev) => ({ ...prev, images: "" }))

      try {
        const response = await productService.uploadImages(Array.from(files))
        if (!response.success || !response.data) {
          throw new Error(response.message || "Image upload failed")
        }

        const newImages: ProductImage[] = response.data.map((img: any, i: number) => ({
          url: img.url,
          publicId: img.publicId,
          position: values.images.length + i,
          isFeatured: values.images.length === 0 && i === 0,
        }))

        setValues((prev) => ({ ...prev, images: [...prev.images, ...newImages] }))
      } catch (error) {
        console.error("Image upload failed:", error)
        setErrors((prev) => ({ ...prev, images: "Failed to upload image(s). Please try again." }))
      } finally {
        setUploadingImages(false)
      }
    },
    [values.images]
  )

  const removeImage = (index: number) => {
    setValues((prev) => {
      const next = prev.images.filter((_, i) => i !== index).map((img, i) => ({ ...img, position: i }))
      // Ensure at least one featured image
      if (next.length > 0 && !next.some((img) => img.isFeatured)) {
        next[0].isFeatured = true
      }
      return { ...prev, images: next }
    })
  }

  const setFeaturedImage = (index: number) => {
    setValues((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, isFeatured: i === index })),
    }))
  }

  const moveImage = (from: number, to: number) => {
    setValues((prev) => {
      const next = [...prev.images]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return { ...prev, images: next.map((img, i) => ({ ...img, position: i })) }
    })
  }

  // ─── Variants handling ─────────────────────────────────────────────────────

  const handleToggleVariants = (enabled: boolean) => {
    setValues((prev) => ({ ...prev, hasVariants: enabled, options: enabled ? prev.options : [], variants: [] }))
  }

  const addOption = () => {
    if (values.options.length >= 3) return
    setValues((prev) => ({ ...prev, options: [...prev.options, { name: "", options: [] }] }))
  }

  const updateOptionName = (index: number, name: string) => {
    setValues((prev) => {
      const options = [...prev.options]
      options[index] = { ...options[index], name }
      return { ...prev, options }
    })
  }

  const addOptionValue = (optionIndex: number) => {
    setValues((prev) => {
      const options = [...prev.options]
      if (!options[optionIndex].options) options[optionIndex].options = []
      options[optionIndex].options.push({ value: "", price: 0 })
      return { ...prev, options }
    })
  }

  const updateOptionValue = (optionIndex: number, valueIndex: number, value: string) => {
    setValues((prev) => {
      const options = [...prev.options]
      options[optionIndex].options[valueIndex] = {
        ...options[optionIndex].options[valueIndex],
        value,
      }
      return { ...prev, options }
    })
  }

  const updateOptionPrice = (optionIndex: number, valueIndex: number, price: number) => {
    setValues((prev) => {
      const options = [...prev.options]
      options[optionIndex].options[valueIndex] = {
        ...options[optionIndex].options[valueIndex],
        price,
      }
      return { ...prev, options }
    })
  }

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    setValues((prev) => {
      const options = [...prev.options]
      options[optionIndex].options = options[optionIndex].options.filter((_, i) => i !== valueIndex)
      return { ...prev, options }
    })
  }

  const removeOption = (index: number) => {
    setValues((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  // Auto-generate variants from options
  const generateVariants = () => {
    const optionsForCombos = values.options.filter((o) => o.name && o.options.length > 0)
    const combos = generateVariantCombination(optionsForCombos)
    const existing = Object.fromEntries(
      values.variants.map((v) => [JSON.stringify(v.attributes), v])
    )
    const nextVariants: ProductVariant[] = combos.map((attrs) => {
      const key = JSON.stringify(attrs)
      return existing[key] || {
        sku: "",
        price: values.price,
        compareAtPrice: null,
        inStock: true,
        stockNote: "",
        image: null,
        isActive: true,
        attributes: attrs,
      }
    })
    setValues((prev) => ({ ...prev, variants: nextVariants }))
  }

  const updateVariant = (index: number, field: keyof ProductVariant, val: any) => {
    setValues((prev) => {
      const variants = [...prev.variants]
      variants[index] = { ...variants[index], [field]: val }
      return { ...prev, variants }
    })
  }

  // ─── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const nextErrors: Record<string, string> = {}
    if (!values.name.trim()) nextErrors.name = "Name is required"
    if (!values.category.trim()) nextErrors.category = "Category is required"
    if (!Number.isFinite(values.price) || values.price < 0) nextErrors.price = "Price must be a non-negative number"

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    await onSubmit({
      ...values,
      price: Number(values.price),
      relatedProducts: relatedProductsText
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ─── Basic Info ─────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input value={values.name} onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))} />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug *</label>
              <Input
                value={values.slug}
                onChange={(e) => { setSlugManuallyEdited(true); setValues((p) => ({ ...p, slug: e.target.value })) }}
              />
              {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU</label>
              <Input value={values.sku ?? ""} onChange={(e) => setValues((p) => ({ ...p, sku: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (PKR) *</label>
              <Input type="number" min="0" value={values.price} onChange={(e) => setValues((p) => ({ ...p, price: Number(e.target.value) }))} />
              {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Compare-at Price (PKR)</label>
              <Input type="number" min="0" value={values.compareAtPrice ?? ""} onChange={(e) => setValues((p) => ({ ...p, compareAtPrice: e.target.value ? Number(e.target.value) : null }))} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <Select value={values.category} onValueChange={(v) => setValues((p) => ({ ...p, category: v, collection: "" }))}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Collections</label>
              <div className="grid gap-2">
                {filteredCollections.length > 0 ? (
                  filteredCollections.map((col) => {
                    const checked = values.collections?.includes(col.id) ?? false
                    return (
                      <label key={col.id} className="inline-flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            setValues((prev) => {
                              const nextCollectionIds = new Set(prev.collections || [])
                              if (isChecked) {
                                nextCollectionIds.add(col.id)
                              } else {
                                nextCollectionIds.delete(col.id)
                              }
                              const nextCollections = Array.from(nextCollectionIds)
                              return {
                                ...prev,
                                collections: nextCollections,
                                collection: nextCollections[0] || "",
                              }
                            })
                          }}
                        />
                        {col.name}
                      </label>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No collections available for the selected category.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <textarea
              className="min-h-28 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm"
              value={values.description}
              onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>
        </CardContent>
      </Card>

      {/* ─── Images ──────────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader><CardTitle>Images</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* Drop zone */}
          <div
            className={`relative flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files) }}
            onClick={() => document.getElementById("product-image-input")?.click()}
          >
            <input
              id="product-image-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {uploadingImages ? "Uploading…" : "Drop images here or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WebP — max 5 MB each</p>
            {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
          </div>

          {/* Image thumbnails */}
          {values.images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {values.images.map((img, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
                  <img src={img.url} alt={`Product image ${i + 1}`} className="h-full w-full object-cover" />
                  {/* Featured badge */}
                  {img.isFeatured && (
                    <Badge className="absolute left-1 top-1 bg-amber-500 text-white text-[10px] px-1 py-0">
                      Featured
                    </Badge>
                  )}
                  {/* Controls */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button type="button" title="Set as featured" onClick={() => setFeaturedImage(i)} className="rounded bg-white/20 p-1 text-white hover:bg-white/40">
                      <Star className={`h-3.5 w-3.5 ${img.isFeatured ? "fill-amber-400 text-amber-400" : ""}`} />
                    </button>
                    {i > 0 && (
                      <button type="button" title="Move left" onClick={() => moveImage(i, i - 1)} className="rounded bg-white/20 px-1 text-white hover:bg-white/40 text-xs">←</button>
                    )}
                    {i < values.images.length - 1 && (
                      <button type="button" title="Move right" onClick={() => moveImage(i, i + 1)} className="rounded bg-white/20 px-1 text-white hover:bg-white/40 text-xs">→</button>
                    )}
                    <button type="button" title="Remove" onClick={() => removeImage(i)} className="rounded bg-red-500/80 p-1 text-white hover:bg-red-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">Click ★ to mark featured · Use ← → to reorder · First image is featured by default</p>
        </CardContent>
      </Card>

      {/* ─── Product Details (Dynamic) ────────────────────────────────── */}
      <Card>
        <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Add unlimited custom detail sections (Dimensions, Materials, Warranty, Care Instructions, etc.)</p>
          
          {values.productDetails?.length === 0 && (
            <div className="rounded-md border border-dashed border-gray-300 p-6 text-center">
              <p className="text-sm text-gray-600">No details added yet.</p>
            </div>
          )}
          
          {values.productDetails?.map((detail, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_2fr_auto] items-end rounded-md border p-4 bg-muted/30">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Label</label>
                <Input
                  value={detail.label ?? ""}
                  onChange={(e) => setValues((prev) => {
                    const next = [...(prev.productDetails || [])]
                    next[index] = { ...next[index], label: e.target.value }
                    return { ...prev, productDetails: next }
                  })}
                  placeholder="e.g. Dimensions, Materials, Warranty"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Value</label>
                <Input
                  value={detail.value ?? ""}
                  onChange={(e) => setValues((prev) => {
                    const next = [...(prev.productDetails || [])]
                    next[index] = { ...next[index], value: e.target.value }
                    return { ...prev, productDetails: next }
                  })}
                  placeholder="e.g. 120cm × 60cm × 45cm"
                  className="h-8 text-sm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:bg-red-50"
                onClick={() => setValues((prev) => ({
                  ...prev,
                  productDetails: (prev.productDetails || []).filter((_, i) => i !== index),
                }))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setValues((prev) => ({
              ...prev,
              productDetails: [...(prev.productDetails || []), { label: "", value: "" }],
            }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Detail
          </Button>
        </CardContent>
      </Card>

      {/* ─── Variants ────────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Variants</CardTitle>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Has Variants</label>
              <Switch
                checked={values.hasVariants ?? false}
                onCheckedChange={handleToggleVariants}
              />
            </div>
          </div>
        </CardHeader>
        {values.hasVariants && (
          <CardContent className="space-y-6">
            {/* Option builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Options <span className="text-muted-foreground">(up to 3)</span></p>
                {values.options.length < 3 && (
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    <Plus className="mr-1 h-3.5 w-3.5" />Add Option
                  </Button>
                )}
              </div>
              {values.options.map((opt, i) => (
                <div key={i} className="rounded-md border p-4 space-y-3 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Option name (e.g. Size)"
                      value={opt.name}
                      onChange={(e) => updateOptionName(i, e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(i)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  {/* Option values with pricing */}
                  <div className="space-y-2">
                    {opt.options.map((optVal, j) => (
                      <div key={j} className="flex items-center gap-2 bg-white rounded p-2 border border-gray-100">
                        <Input
                          placeholder="Value (e.g. Small)"
                          value={optVal.value}
                          onChange={(e) => updateOptionValue(i, j, e.target.value)}
                          className="flex-1 h-8"
                        />
                        <Input
                          type="number"
                          placeholder="Price"
                          value={optVal.price}
                          onChange={(e) => updateOptionPrice(i, j, Number(e.target.value))}
                          className="w-24 h-8"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeOptionValue(i, j)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOptionValue(i)}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />Add Value
                  </Button>
                </div>
              ))}
            </div>

            {values.options.some((o) => o.name && o.options.length > 0) && (
              <Button type="button" variant="outline" onClick={generateVariants}>
                Generate Variant Table
              </Button>
            )}

            {/* Variant table */}
            {values.variants.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      {values.options.map((o) => <th key={o.name} className="pb-2 pr-3 font-medium">{o.name}</th>)}
                      <th className="pb-2 pr-3 font-medium">SKU</th>
                      <th className="pb-2 pr-3 font-medium">Price</th>
                      <th className="pb-2 pr-3 font-medium">In Stock</th>
                      <th className="pb-2 font-medium">Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {values.variants.map((variant, vi) => (
                      <tr key={vi} className="py-2">
                        {values.options.map((o) => (
                          <td key={o.name} className="pr-3 py-1.5">
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                              {variant.attributes?.[o.name] || "—"}
                            </span>
                          </td>
                        ))}
                        <td className="pr-3 py-1.5">
                          <Input
                            className="h-7 text-xs"
                            value={variant.sku ?? ""}
                            onChange={(e) => updateVariant(vi, "sku", e.target.value)}
                            placeholder="SKU"
                          />
                        </td>
                        <td className="pr-3 py-1.5">
                          <Input
                            type="number"
                            className="h-7 w-24 text-xs"
                            value={variant.price ?? values.price}
                            onChange={(e) => updateVariant(vi, "price", Number(e.target.value))}
                          />
                        </td>
                        <td className="pr-3 py-1.5">
                          <Checkbox
                            checked={variant.inStock}
                            onCheckedChange={(c) => updateVariant(vi, "inStock", Boolean(c))}
                          />
                        </td>
                        <td className="py-1.5">
                          <Checkbox
                            checked={variant.isActive}
                            onCheckedChange={(c) => updateVariant(vi, "isActive", Boolean(c))}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ─── Stock & Visibility ──────────────────────────────────────────────── */}
      <Card>
        <CardHeader><CardTitle>Stock & Visibility</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Stock Note</label>
            <Input value={values.stockNote ?? ""} onChange={(e) => setValues((p) => ({ ...p, stockNote: e.target.value }))} placeholder="e.g. Back order — arriving next month" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Related Products <span className="text-xs text-muted-foreground">(comma-separated IDs or slugs)</span></label>
            <Input placeholder="prod-1, prod-2" value={relatedProductsText} onChange={(e) => setRelatedProductsText(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={values.inStock} onCheckedChange={(c) => setValues((p) => ({ ...p, inStock: Boolean(c) }))} />
              In Stock
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={values.isActive ?? true} onCheckedChange={(c) => setValues((p) => ({ ...p, isActive: Boolean(c) }))} />
              Visible on Storefront (Published)
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting} size="lg">
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  )
}
