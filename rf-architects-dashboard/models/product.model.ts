import { z } from "zod"

// ─── Image shape ──────────────────────────────────────────────────────────────
export interface ProductImage {
  url: string
  publicId: string | null
  position: number
  isFeatured: boolean
}

// ─── Variant support ──────────────────────────────────────────────────────────
export interface VariantOption {
  value: string
  price: number
}

export interface ProductOption {
  name: string           // e.g. "Size", "Colour", "Shape"
  options: VariantOption[] // e.g. [{value: "Small", price: 400}, {value: "Medium", price: 500}]
}

export interface ProductVariant {
  _id?: string
  sku?: string
  price?: number
  compareAtPrice?: number | null
  inStock: boolean
  stockNote?: string
  image?: string | null
  isActive: boolean
  attributes: Record<string, string> // e.g. { Size: "Large", Colour: "Black" }
}

export interface ProductDetail {
  label: string
  value: string
}

// ─── Core Product interface ───────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  compareAtPrice?: number | null
  category: string        // ObjectId or populated Category
  collection?: string      // Primary collection id or populated Collection
  collections?: string[]   // One or more assigned collection ids
  images: ProductImage[]
  description: string
  productDetails?: ProductDetail[]  // Dynamic label/value pairs (Dimensions, Materials, Warranty, etc.)
  inStock: boolean
  stockNote: string
  hasVariants: boolean
  options: ProductOption[]
  variants: ProductVariant[]
  relatedProducts?: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Zod form schema ──────────────────────────────────────────────────────────
const productImageSchema = z.object({
  url: z.string().min(1),
  publicId: z.string().nullable().optional(),
  position: z.number().int().min(0),
  isFeatured: z.boolean(),
})

const variantOptionSchema = z.object({
  value: z.string().min(1, "Value is required"),
  price: z.coerce.number().min(0, "Price must be non-negative").default(0),
})

const productOptionSchema = z.object({
  name: z.string().min(1, "Option name is required"),
  options: z.array(variantOptionSchema).min(1, "At least one option value required"),
})

const productVariantSchema = z.object({
  _id: z.string().optional(),
  sku: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  compareAtPrice: z.coerce.number().min(0).nullable().optional(),
  inStock: z.boolean(),
  stockNote: z.string().optional(),
  image: z.string().nullable().optional(),
  isActive: z.boolean(),
  attributes: z.record(z.string()),
})

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  sku: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().min(0).nullable().optional(),
  category: z.string().min(1, "Category is required"),
  collection: z.string().optional(),
  collections: z.array(z.string()).optional().default([]),
  images: z.array(productImageSchema).optional().default([]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  // Dynamic product details (Dimensions, Materials, Warranty, etc.)
  productDetails: z.array(z.object({
    label: z.string().min(1, "Detail label is required"),
    value: z.string().min(1, "Detail value is required"),
  })).optional().default([]),
  inStock: z.boolean(),
  stockNote: z.string().optional(),
  hasVariants: z.boolean().optional().default(false),
  options: z.array(productOptionSchema).optional().default([]),
  variants: z.array(productVariantSchema).optional().default([]),
  relatedProducts: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(false),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
