import mongoose from 'mongoose';
import { generateSlug, ensureUniqueSlug } from '../utils/slugify.js';

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: null },
    position: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { _id: false }
);

const productOptionSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true }, // e.g. "Size", "Colour", "Shape"
    options: [
      {
        value: { type: String },  // e.g. "Small", "Medium", "Large"
        price: { type: Number, default: 0 },     // Price for this specific value
      },
    ],
  },
  { _id: false }
);

const productVariantSchema = new mongoose.Schema(
  {
    sku: { type: String },
    price: { type: Number, min: 0 },
    compareAtPrice: { type: Number, min: 0, default: null },
    inStock: { type: Boolean, default: true },
    stockNote: { type: String, default: '' },
    image: { type: String, default: null }, // URL of variant-specific image
    isActive: { type: Boolean, default: true },
    attributes: {
      type: Map,
      of: String, // e.g. { Size: "Large", Colour: "Black" }
    },
  },
  { _id: true }
);

// ─── Main Product Schema ─────────────────────────────────────────────────────

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
    },
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
      },
    ],
    description: {
      type: String,
      default: '',
    },
    // Rich image array — replaces old flat images: [String]
    images: [productImageSchema],

    // Dynamic product details — replaces hardcoded dimension, materials, etc. fields
    // Admin can create unlimited label/value pairs like: Dimensions, Materials, Warranty, etc.
    productDetails: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],

    // Legacy detail field (same structure) — can be deprecated or merged into productDetails
    details: [
      {
        label: { type: String, trim: true, default: '' },
        description: { type: String, default: '' },
      },
    ],

    // Stock
    inStock: { type: Boolean, default: true },
    stockNote: { type: String, default: '' },

    // Variants
    hasVariants: { type: Boolean, default: false },
    variantGroups: [
      {
        name: { type: String, trim: true, default: '' },
        options: [
          {
            value: { type: String, default: '' },
            price: { type: Number, default: 0 },
          },
        ],
      },
    ],
    options: [productOptionSchema],
    variants: [productVariantSchema],

    // Relations
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-generate slug
productSchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();
  try {
    const baseSlug = generateSlug(this.name);
    this.slug = await ensureUniqueSlug(this.constructor, baseSlug, this._id);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Product', productSchema);
