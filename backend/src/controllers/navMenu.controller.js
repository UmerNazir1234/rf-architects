import { NavMenu, NavMenuItem } from '../models/NavMenu.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Compute the public href for a nav item based on its linkType.
 */
function computeHref(item, categorySlug, collectionSlug) {
  switch (item.linkType) {
    case 'category':
      return categorySlug ? `/shop?category=${categorySlug}` : '/shop';
    case 'collection':
      return collectionSlug ? `/collections/${collectionSlug}` : '/collections';
    case 'custom_url':
    case 'page':
      return item.targetUrl || '/';
    default:
      return '#';
  }
}

/**
 * Build a nested tree from a flat list of NavMenuItems.
 * Root items have parentId === null.
 */
function buildTree(items) {
  const map = {};
  items.forEach((item) => {
    map[item._id.toString()] = { ...item.toObject(), children: [] };
  });

  const roots = [];
  items.forEach((item) => {
    const node = map[item._id.toString()];
    if (item.parentId) {
      const parent = map[item.parentId.toString()];
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  // Sort each level by order
  const sortByOrder = (arr) => {
    arr.sort((a, b) => a.order - b.order);
    arr.forEach((node) => sortByOrder(node.children));
  };
  sortByOrder(roots);

  return roots;
}

// ─── PUBLIC: GET /nav-menus/:handle ──────────────────────────────────────────

export const getPublicNavMenu = asyncHandler(async (req, res) => {
  const { handle } = req.params;

  const menu = await NavMenu.findOne({ handle, isActive: true });
  if (!menu) {
    throw new ApiError(404, 'Menu not found');
  }

  // Fetch only active items, populated with target refs
  const items = await NavMenuItem.find({ menuId: menu._id, isActive: true })
    .populate('targetCategory', 'name slug')
    .populate('targetCollection', 'name slug');

  // Attach computed href to each item
  const itemsWithHref = items.map((item) => {
    const cat = item.targetCategory;
    const col = item.targetCollection;
    const href = computeHref(item, cat?.slug, col?.slug);
    return { ...item.toObject(), href };
  });

  const tree = buildTree(
    itemsWithHref.map((i) => ({ ...i, toObject: () => i }))
  );

  res.status(200).json(new ApiResponse(200, { menu, items: tree }, 'Nav menu retrieved'));
});

// ─── ADMIN: GET /nav-menus/:handle/admin ─────────────────────────────────────

export const getAdminNavMenu = asyncHandler(async (req, res) => {
  const { handle } = req.params;

  const menu = await NavMenu.findOne({ handle });
  if (!menu) {
    throw new ApiError(404, 'Menu not found');
  }

  const items = await NavMenuItem.find({ menuId: menu._id })
    .populate('targetCategory', 'name slug')
    .populate('targetCollection', 'name slug')
    .sort({ order: 1 });

  const itemsWithHref = items.map((item) => {
    const cat = item.targetCategory;
    const col = item.targetCollection;
    const href = computeHref(item, cat?.slug, col?.slug);
    return { ...item.toObject(), href };
  });

  const tree = buildTree(
    itemsWithHref.map((i) => ({ ...i, toObject: () => i }))
  );

  res.status(200).json(new ApiResponse(200, { menu, items: tree }, 'Admin nav menu retrieved'));
});

// ─── ADMIN: POST /nav-menus/:handle/items ────────────────────────────────────

export const createNavMenuItem = asyncHandler(async (req, res) => {
  const { handle } = req.params;
  const { label, linkType, targetCollection, targetCategory, targetUrl, parentId, order, isActive } = req.body;

  const menu = await NavMenu.findOne({ handle });
  if (!menu) {
    throw new ApiError(404, 'Menu not found');
  }

  if (!label) {
    throw new ApiError(400, 'Label is required');
  }

  const item = await NavMenuItem.create({
    menuId: menu._id,
    label,
    linkType: linkType || 'none',
    targetCollection: targetCollection || null,
    targetCategory: targetCategory || null,
    targetUrl: targetUrl || null,
    parentId: parentId || null,
    order: order !== undefined ? order : 0,
    isActive: isActive !== undefined ? isActive : true,
  });

  await item.populate('targetCategory targetCollection');

  res.status(201).json(new ApiResponse(201, item, 'Nav item created'));
});

// ─── ADMIN: PUT /nav-menus/:handle/items/:id ─────────────────────────────────

export const updateNavMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { label, linkType, targetCollection, targetCategory, targetUrl, parentId, order, isActive } = req.body;

  const item = await NavMenuItem.findByIdAndUpdate(
    id,
    { $set: { label, linkType, targetCollection, targetCategory, targetUrl, parentId, order, isActive } },
    { new: true, runValidators: true }
  ).populate('targetCategory targetCollection');

  if (!item) {
    throw new ApiError(404, 'Nav item not found');
  }

  res.status(200).json(new ApiResponse(200, item, 'Nav item updated'));
});

// ─── ADMIN: PATCH /nav-menus/:handle/items/reorder ───────────────────────────

export const reorderNavMenuItems = asyncHandler(async (req, res) => {
  const { items } = req.body; // [{ id, order, parentId }]

  if (!Array.isArray(items)) {
    throw new ApiError(400, 'Items must be an array');
  }

  const updatePromises = items.map(({ id, order, parentId }) =>
    NavMenuItem.findByIdAndUpdate(
      id,
      { $set: { order, parentId: parentId || null } },
      { new: true }
    )
  );

  await Promise.all(updatePromises);

  res.status(200).json(new ApiResponse(200, {}, 'Nav items reordered'));
});

// ─── ADMIN: DELETE /nav-menus/:handle/items/:id ──────────────────────────────

export const deleteNavMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Cascade: delete all children
  const item = await NavMenuItem.findById(id);
  if (!item) {
    throw new ApiError(404, 'Nav item not found');
  }

  // Delete children recursively (one level — for deeper trees extend as needed)
  await NavMenuItem.deleteMany({ parentId: id });
  await item.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, 'Nav item deleted'));
});
