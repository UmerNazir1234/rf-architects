import mongoose from 'mongoose';
import { generateSlug, ensureUniqueSlug } from '../utils/slugify.js';

// ─── Condition sub-schema (for automated collections) ────────────────────────
const conditionSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      enum: ['category', 'collection', 'price', 'inStock', 'name', 'tag'],
      required: true,
    },
    operator: {
      type: String,
      enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'],
      required: true,
    },
    value: { type: String, required: true },
  },
  { _id: false }
);

// ─── Main Collection Schema ──────────────────────────────────────────────────
const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    coverImage: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },

    // Manual vs Automated
    type: {
      type: String,
      enum: ['manual', 'automated'],
      default: 'manual',
    },

    // Manual: explicit product list (ordered)
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    // Automated: rule-based product matching
    conditions: [conditionSchema],
    matchType: {
      type: String,
      enum: ['all', 'any'], // AND vs OR
      default: 'all',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug
collectionSchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();
  try {
    const baseSlug = generateSlug(this.name);
    this.slug = await ensureUniqueSlug(this.constructor, baseSlug, this._id);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Collection', collectionSchema);
