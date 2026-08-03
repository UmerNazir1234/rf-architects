import mongoose from 'mongoose';

// ─── NavMenu (top-level container, e.g. "main-navbar") ──────────────────────
const navMenuSchema = new mongoose.Schema(
  {
    handle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── NavMenuItem (tree node) ─────────────────────────────────────────────────
const navMenuItemSchema = new mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NavMenu',
      required: true,
      index: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    linkType: {
      type: String,
      enum: ['collection', 'category', 'custom_url', 'page', 'none'],
      default: 'none',
    },
    // For linkType === 'collection': ObjectId ref to Collection
    targetCollection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      default: null,
    },
    // For linkType === 'category': ObjectId ref to Category
    targetCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    // For linkType === 'custom_url' or 'page': the URL string
    targetUrl: {
      type: String,
      default: null,
    },
    // Tree structure
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NavMenuItem',
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const NavMenu = mongoose.model('NavMenu', navMenuSchema);
export const NavMenuItem = mongoose.model('NavMenuItem', navMenuItemSchema);
