import mongoose from 'mongoose';
import { generateSlug, ensureUniqueSlug } from '../utils/slugify.js';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-generate slug with uniqueness handling
categorySchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();
  try {
    const baseSlug = generateSlug(this.name);
    this.slug = await ensureUniqueSlug(this.constructor, baseSlug, this._id);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Category', categorySchema);
