import mongoose from 'mongoose';
import { generateSlug, ensureUniqueSlug } from '../utils/slugify.js';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    location: String,
    year: Number,
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    cover_image: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    gallery_images: [String],
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    concept_label: {
      type: String,
      default: 'The Concept',
    },
    concept_subheading: String,
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-generate slug with uniqueness handling
projectSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();
  try {
    const baseSlug = generateSlug(this.title);
    this.slug = await ensureUniqueSlug(this.constructor, baseSlug, this._id);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Project', projectSchema);
