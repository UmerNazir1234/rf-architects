import Collection from '../models/Collection.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function resolveCategoryId(categoryRef) {
  if (!categoryRef) return null;

  if (mongoose.Types.ObjectId.isValid(categoryRef)) {
    const category = await Category.findById(categoryRef);
    return category ? category._id.toString() : null;
  }

  const category = await Category.findOne({
    name: { $regex: new RegExp(`^${categoryRef}$`, 'i') },
  });

  return category ? category._id.toString() : null;
}

/**
 * Build a Mongo filter from a collection's automated conditions array.
 * Conditions use field/operator/value tuples; matchType controls AND vs OR.
 */
function buildAutomatedFilter(conditions = [], matchType = 'all') {
  const clauses = conditions.map(({ field, operator, value }) => {
    switch (operator) {
      case 'equals':
        return { [field]: value };
      case 'not_equals':
        return { [field]: { $ne: value } };
      case 'contains':
        return { [field]: { $regex: value, $options: 'i' } };
      case 'greater_than':
        return { [field]: { $gt: Number(value) } };
      case 'less_than':
        return { [field]: { $lt: Number(value) } };
      default:
        return {};
    }
  });

  if (clauses.length === 0) return {};
  return matchType === 'any' ? { $or: clauses } : { $and: clauses };
}

// ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

export const getPublicCollections = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category && mongoose.Types.ObjectId.isValid(category)) filter.category = category;

  const collections = await Collection.find(filter)
    .populate('category')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, collections, 'Collections retrieved'));
});

export const getPublicCollectionBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const collection = await Collection.findOne({ slug, isActive: true }).populate('category');

  if (!collection) {
    throw new ApiError(404, 'Collection not found');
  }

  let products;

  if (collection.type === 'automated') {
    // Resolve category name/values to ObjectId if they match category field
    const resolvedConditions = await Promise.all(
      (collection.conditions || []).map(async (cond) => {
        if (cond.field === 'category' && !mongoose.Types.ObjectId.isValid(cond.value)) {
          const cat = await Category.findOne({ name: { $regex: new RegExp(`^${cond.value}$`, 'i') } });
          if (cat) {
            return { field: cond.field, operator: cond.operator, value: cat._id.toString() };
          }
        }
        return cond;
      })
    );

    // Build query from resolved conditions
    const conditionFilter = buildAutomatedFilter(resolvedConditions, collection.matchType);
    products = await Product.find({ ...conditionFilter, isActive: true }).populate('category');
  } else {
    // Manual: use explicit productIds list (preserves order)
    if (collection.productIds && collection.productIds.length > 0) {
      const productMap = await Product.find({
        _id: { $in: collection.productIds },
        isActive: true,
      })
        .populate('category')
        .populate('collection')
        .populate('collections');

      const mapById = Object.fromEntries(productMap.map((p) => [p._id.toString(), p]));
      products = collection.productIds
        .map((id) => mapById[id.toString()])
        .filter(Boolean);
    } else {
      // Fallback: products that reference this collection by FK or via the collections array
      products = await Product.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { collection: collection._id },
              { collections: collection._id },
            ],
          },
        ],
      })
        .populate('category')
        .populate('collection')
        .populate('collections');
    }
  }

  res.status(200).json(
    new ApiResponse(200, { collection, products }, 'Collection retrieved')
  );
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

export const getAdminCollections = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, category } = req.query;

  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (category && mongoose.Types.ObjectId.isValid(category)) filter.category = category;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const collections = await Collection.find(filter)
    .populate('category')
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const total = await Collection.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        collections,
        pagination: { total, pages: Math.ceil(total / limitNum), currentPage: pageNum },
      },
      'Admin collections retrieved'
    )
  );
});

export const createCollection = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    coverImage,
    description,
    type,
    productIds,
    conditions,
    matchType,
    isActive,
  } = req.body;

  if (!name || !category) {
    throw new ApiError(400, 'Name and category are required');
  }

  const resolvedCategoryId = await resolveCategoryId(category);
  if (!resolvedCategoryId) {
    throw new ApiError(400, 'Category not found');
  }

  const collection = await Collection.create({
    name,
    category: resolvedCategoryId,
    coverImage,
    description,
    type: type || 'manual',
    productIds: productIds || [],
    conditions: conditions || [],
    matchType: matchType || 'all',
    isActive: isActive !== undefined ? isActive : true,
  });

  await collection.populate('category');

  res.status(201).json(new ApiResponse(201, collection, 'Collection created'));
});

export const updateCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    coverImage,
    description,
    type,
    productIds,
    conditions,
    matchType,
    isActive,
  } = req.body;

  const resolvedCategoryId = await resolveCategoryId(category);
  if (!resolvedCategoryId) {
    throw new ApiError(400, 'Category not found');
  }

  const collection = await Collection.findByIdAndUpdate(
    id,
    { $set: { name, category: resolvedCategoryId, coverImage, description, type, productIds, conditions, matchType, isActive } },
    { new: true, runValidators: true }
  ).populate('category');

  if (!collection) {
    throw new ApiError(404, 'Collection not found');
  }

  res.status(200).json(new ApiResponse(200, collection, 'Collection updated'));
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Instead of throwing an error, we will unlink the collection from associated products
  await Product.updateMany({ collection: id }, { $unset: { collection: 1 } });
  await Product.updateMany({ collections: id }, { $pull: { collections: id } });

  const collection = await Collection.findByIdAndDelete(id);

  if (!collection) {
    throw new ApiError(404, 'Collection not found');
  }

  res.status(200).json(new ApiResponse(200, {}, 'Collection deleted'));
});

/**
 * Dry-run preview for automated collections — returns matching products
 * without requiring the collection to be saved first.
 * Body: { conditions, matchType }
 */
export const previewCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Accept conditions from body (for unsaved preview) or fall back to DB
  const collection = await Collection.findById(id);
  if (!collection) {
    throw new ApiError(404, 'Collection not found');
  }

  const conditions = req.body.conditions ?? collection.conditions;
  const matchType = req.body.matchType ?? collection.matchType;

  // Resolve category name/values to ObjectId if they match category field
  const resolvedConditions = await Promise.all(
    (conditions || []).map(async (cond) => {
      if (cond.field === 'category' && !mongoose.Types.ObjectId.isValid(cond.value)) {
        const cat = await Category.findOne({ name: { $regex: new RegExp(`^${cond.value}$`, 'i') } });
        if (cat) {
          return { field: cond.field, operator: cond.operator, value: cat._id.toString() };
        }
      }
      return cond;
    })
  );

  const conditionFilter = buildAutomatedFilter(resolvedConditions, matchType);
  const products = await Product.find({ ...conditionFilter, isActive: true })
    .populate('category')
    .limit(50); // preview cap

  res.status(200).json(
    new ApiResponse(200, { products, count: products.length }, 'Preview results')
  );
});
