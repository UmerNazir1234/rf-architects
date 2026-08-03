import { z } from "zod"

// ─── Collection ───────────────────────────────────────────────────────────────
export interface CollectionCondition {
  field: "category" | "collection" | "price" | "inStock" | "name" | "tag"
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
  value: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  category: string        // ObjectId or populated Category.name
  coverImage: string
  description: string
  type: "manual" | "automated"
  productIds?: string[]   // Manual: explicit ordered product list
  conditions?: CollectionCondition[]  // Automated: rule set
  matchType?: "all" | "any"
  productCount?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: string
  name: string
  slug?: string
  order: number
  createdAt: Date
}

// ─── NavMenu / NavMenuItem ────────────────────────────────────────────────────
export type NavItemLinkType = "collection" | "category" | "custom_url" | "page" | "none"

export interface NavMenuItem {
  id: string
  menuId: string
  label: string
  linkType: NavItemLinkType
  targetCollection?: string | null
  targetCategory?: string | null
  targetUrl?: string | null
  href?: string          // Server-computed resolved URL
  parentId?: string | null
  order: number
  isActive: boolean
  children?: NavMenuItem[]
  createdAt?: Date
  updatedAt?: Date
}

export interface NavMenu {
  id: string
  handle: string
  label: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export interface Project {
  id: string
  _id?: string
  title: string
  slug: string
  location: string
  year: number
  category: string
  concept_label: string
  concept_subheading: string
  description: string
  cover_image: string
  gallery_images: string[]
  order: number
  isFeatured: boolean
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  location: z.string().min(1, "Location is required"),
  year: z.coerce.number().min(2000),
  category: z.string().min(1, "Category is required"),
  concept_label: z.string().default("The Concept"),
  concept_subheading: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cover_image: z.string().min(1, "Cover image is required"),
  gallery_images: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>

// ─── FAQs ─────────────────────────────────────────────────────────────────────
export interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Site Statistics ──────────────────────────────────────────────────────────
export interface SiteStat {
  id: string
  label: string
  value: number
  sublabel: string
}

// ─── Users ────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  role: "superadmin" | "editor" | "viewer"
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export interface Settings {
  id: string
  phone: string
  email: string
  address: string
  tiktok: string
  facebook: string
  instagram: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  updatedAt: Date
}
