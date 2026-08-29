import Product from '../models/Product.js';
import Collection from '../models/Collection.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

function normalizeProductImages(value) {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (!item) return null;

        if (typeof item === 'string') {
          return {
            url: item,
            publicId: null,
            position: index,
            isFeatured: index === 0,
          };
        }

        if (typeof item === 'object') {
          const url = item.url || item.secure_url || item.image || item.src || item.path;
          if (!url) return null;

          return {
            url,
            publicId: item.publicId ?? item.public_id ?? null,
            position: item.position ?? index,
            isFeatured: item.isFeatured ?? index === 0,
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [{ url: value, publicId: null, position: 0, isFeatured: true }];
  }

  if (value && typeof value === 'object') {
    const url = value.url || value.secure_url || value.image || value.src || value.path;
    if (url) {
      return [{
        url,
        publicId: value.publicId ?? value.public_id ?? null,
        position: 0,
        isFeatured: true,
      }];
    }
  }

  return [];
}

async function resolveCollectionId(collectionRef) {
  if (!collectionRef) return null;

  if (mongoose.Types.ObjectId.isValid(collectionRef)) {
    const col = await Collection.findById(collectionRef);
    return col ? col._id.toString() : null;
  }

  const col = await Collection.findOne({
    $or: [
      { slug: collectionRef },
      { name: { $regex: new RegExp(`^${collectionRef}$`, 'i') } },
    ],
  });

  return col ? col._id.toString() : null;
}

// ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

export const getPublicProducts = asyncHandler(async (req, res) => {
  const { category, collection, sort, page = 1, limit = 1000, search } = req.query;

  const filter = { isActive: true };

  if (category && mongoose.Types.ObjectId.isValid(category)) filter.category = category;

  if (collection && mongoose.Types.ObjectId.isValid(collection)) {
    filter.$or = [
      { collection },
      { collections: collection },
    ];
  }

  if (search) {
    const searchClauses = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    filter.$or = filter.$or
      ? [...filter.$or, ...searchClauses]
      : searchClauses;
  }

  let query = Product.find(filter)
    .populate('category')
    .populate('collection')
    .populate('collections')
    .populate('relatedProducts');

  if (sort === 'price_asc') query = query.sort({ price: 1 });
  else if (sort === 'price_desc') query = query.sort({ price: -1 });
  else query = query.sort({ createdAt: -1 });

  const pageNum = parseInt(page, 10) || 1;
  const requestedLimit = parseInt(limit, 10);
  const limitNum = Number.isFinite(requestedLimit) && requestedLimit > 0 ? requestedLimit : 1000;
  const skip = (pageNum - 1) * limitNum;

  const products = await query.skip(skip).limit(limitNum);
  const total = await Product.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          pages: Math.ceil(total / limitNum) || 1,
          currentPage: pageNum,
          limit: limitNum,
        },
      },
      'Products retrieved'
    )
  );
});

export const getPublicProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug, isActive: true })
    .populate('category')
    .populate('collection')
    .populate('collections')
    .populate('relatedProducts');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json(new ApiResponse(200, product, 'Product retrieved'));
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug, isActive: true });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const related = await Product.find({
    _id: { $in: product.relatedProducts },
    isActive: true,
  }).limit(4);

  res.status(200).json(new ApiResponse(200, related, 'Related products retrieved'));
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

export const getAdminProducts = asyncHandler(async (req, res) => {
  const { category, collection, status, page = 1, limit = 20, search } = req.query;

  const filter = {};

  if (category && mongoose.Types.ObjectId.isValid(category)) filter.category = category;
  if (collection && mongoose.Types.ObjectId.isValid(collection)) filter.collection = collection;
  if (status === 'active') filter.isActive = true;
  else if (status === 'draft') filter.isActive = false;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(filter)
    .populate('category')
    .populate('collection')
    .populate('collections')
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          pages: Math.ceil(total / limitNum),
          currentPage: pageNum,
        },
      },
      'Admin products retrieved'
    )
  );
});

export const getAdminProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate('category')
    .populate('collection')
    .populate('collections')
    .populate('relatedProducts');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json(new ApiResponse(200, product, 'Product retrieved'));
});

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    compareAtPrice,
    category,
    collection,
    collections,
    description,
    images,
    image,
    sku,
    productDetails,
    details,
    inStock,
    stockNote,
    relatedProducts,
    hasVariants,
    variantGroups,
    options,
    variants,
    isActive,
  } = req.body;

  // Validate required fields
  if (!name || name.trim() === '') {
    throw new ApiError(400, 'Product name is required and cannot be empty');
  }

  if (price === undefined || price === null || price === '') {
    throw new ApiError(400, 'Price is required');
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    throw new ApiError(400, 'Price must be a valid positive number');
  }

  // Normalize productDetails (new dynamic details system)
  const productDetailsArr = Array.isArray(productDetails)
    ? productDetails
        .filter((item) => item && item.label && String(item.label).trim() && item.value && String(item.value).trim())
        .map((item) => ({
          label: String(item.label || '').trim(),
          value: String(item.value || '').trim(),
        }))
    : [];

  // Legacy details field (keep for backward compatibility)
  const detailsArr = Array.isArray(details)
    ? details
        .filter((item) => item && (item.label || item.description))
        .map((item) => ({
          label: String(item.label || '').trim(),
          description: String(item.description || '').trim(),
        }))
    : [];

  // Normalize variantGroups with per-value pricing
  const variantGroupsArr = Array.isArray(variantGroups)
    ? variantGroups
        .filter((group) => group && group.name && String(group.name).trim())
        .map((group) => {
          const normalized = {
            name: String(group.name || '').trim(),
            options: [],
          };

          // Handle options array with {value, price} structure
          if (Array.isArray(group.options)) {
            normalized.options = group.options
              .filter((opt) => opt && opt.value && String(opt.value).trim())
              .map((opt) => ({
                value: String(opt.value || '').trim(),
                price: typeof opt.price === 'number' ? Math.max(0, opt.price) : 0,
              }));
          }

          return normalized;
        })
        .filter((group) => group.options.length > 0) // Only keep groups with at least one option
    : [];

  // Normalize variants array (ensure numeric prices and flags)
  const variantsArr = Array.isArray(variants)
    ? variants
        .filter((v) => v && (v.sku || v.price || v.attributes))
        .map((v) => ({
          sku: v.sku || undefined,
          price: v.price !== undefined && v.price !== null ? parseFloat(v.price) : 0,
          compareAtPrice:
            v.compareAtPrice !== undefined && v.compareAtPrice !== null
              ? parseFloat(v.compareAtPrice)
              : null,
          inStock: v.inStock !== undefined ? !!v.inStock : true,
          stockNote: v.stockNote || '',
          image: v.image || null,
          isActive: v.isActive !== undefined ? !!v.isActive : true,
          attributes: v.attributes || {},
        }))
    : [];

  const normalizedCollections = Array.isArray(collections)
    ? collections
    : collection
    ? [collection]
    : [];

  const resolvedCollectionIds = (
    await Promise.all(
      normalizedCollections
        .filter(Boolean)
        .map(async (ref) => await resolveCollectionId(ref))
    )
  ).filter(Boolean);

  const dedupedCollections = [...new Set(resolvedCollectionIds)];
  const primaryCollection = dedupedCollections[0] || (await resolveCollectionId(collection)) || null;
  const normalizedImages = normalizeProductImages(images ?? image);
  
  // Normalize SKU - only store if non-empty, otherwise leave as undefined
  const normalizedSku = sku && String(sku).trim() ? String(sku).trim() : undefined;

  // If product uses variants, derive the displayed product price from variants
  let finalPrice = parsedPrice;
  if ((hasVariants || variantsArr.length > 0) && variantsArr.length > 0) {
    const activePrices = variantsArr.filter((v) => v.isActive).map((v) => Number(v.price || 0));
    if (activePrices.length > 0) finalPrice = Math.min(...activePrices);
  }

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('CreateProduct Debug:', {
      name,
      price: parsedPrice,
      sku: normalizedSku,
      productDetailsCount: productDetailsArr.length,
      productDetails: productDetailsArr,
      variantGroupsCount: variantGroupsArr.length,
      variantGroups: variantGroupsArr,
      imagesCount: normalizedImages.length,
    });
  }

  const product = await Product.create({
    name: name.trim(),
    price: finalPrice,
    compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
    category,
    collection: primaryCollection,
    collections: dedupedCollections,
    description,
    images: normalizedImages,
    sku: normalizedSku,
    productDetails: productDetailsArr,
    details: detailsArr,
    inStock: inStock !== undefined ? inStock : true,
    stockNote,
    relatedProducts: relatedProducts || [],
    hasVariants: hasVariants || variantsArr.length > 0 || false,
    variantGroups: variantGroupsArr,
    variants: variantsArr,
    options: options || [],
    variants: variants || [],
    isActive: isActive !== undefined ? isActive : false,
  });

  const populatedProduct = await product.populate('category collection collections');

  res.status(201).json(new ApiResponse(201, populatedProduct, 'Product created'));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  // Validate price if provided
  if (updates.price !== undefined && updates.price !== null && updates.price !== '') {
    const parsedPrice = parseFloat(updates.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new ApiError(400, 'Price must be a valid positive number');
    }
    updates.price = parsedPrice;
  }

  if (updates.compareAtPrice !== undefined && updates.compareAtPrice !== null && updates.compareAtPrice !== '') {
    const parsedPrice = parseFloat(updates.compareAtPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new ApiError(400, 'Compare at price must be a valid positive number');
    }
    updates.compareAtPrice = parsedPrice;
  }

  if (updates.collections !== undefined) {
    const collectionIdsRaw = Array.isArray(updates.collections)
      ? updates.collections.filter(Boolean)
      : [];

    const resolved = (
      await Promise.all(collectionIdsRaw.map(async (ref) => await resolveCollectionId(ref)))
    ).filter(Boolean);

    const dedupedCollectionIds = [...new Set(resolved)];
    updates.collections = dedupedCollectionIds;
    updates.collection = dedupedCollectionIds[0] || updates.collection || null;
  } else if (updates.collection !== undefined && !updates.collections) {
    const resolvedSingle = await resolveCollectionId(updates.collection);
    updates.collections = [resolvedSingle].filter(Boolean);
    updates.collection = resolvedSingle || null;
  }

  // Normalize productDetails (new dynamic details system)
  if (updates.productDetails !== undefined && Array.isArray(updates.productDetails)) {
    updates.productDetails = updates.productDetails
      .filter((item) => item && item.label && String(item.label).trim() && item.value && String(item.value).trim())
      .map((item) => ({
        label: String(item.label || '').trim(),
        value: String(item.value || '').trim(),
      }));
  }

  // Legacy details field (keep for backward compatibility)
  if (updates.details !== undefined && Array.isArray(updates.details)) {
    updates.details = updates.details
      .filter((item) => item && (item.label || item.description))
      .map((item) => ({
        label: String(item.label || '').trim(),
        description: String(item.description || '').trim(),
      }));
  }

  if (updates.variantGroups !== undefined && Array.isArray(updates.variantGroups)) {
    updates.variantGroups = updates.variantGroups
      .filter((group) => group && group.name && String(group.name).trim())
      .map((group) => {
        const normalized = {
          name: String(group.name || '').trim(),
          options: [],
        };

        // Handle options array with {value, price} structure
        if (Array.isArray(group.options)) {
          normalized.options = group.options
            .filter((opt) => opt && opt.value && String(opt.value).trim())
            .map((opt) => ({
              value: String(opt.value || '').trim(),
              price: typeof opt.price === 'number' ? Math.max(0, opt.price) : 0,
            }));
        }

        return normalized;
      })
      .filter((group) => group.options.length > 0) // Only keep groups with at least one option
  }

  // Normalize variants if provided in update
  if (updates.variants !== undefined && Array.isArray(updates.variants)) {
    updates.variants = updates.variants
      .filter((v) => v && (v.sku || v.price || v.attributes))
      .map((v) => ({
        sku: v.sku || undefined,
        price: v.price !== undefined && v.price !== null ? parseFloat(v.price) : 0,
        compareAtPrice:
          v.compareAtPrice !== undefined && v.compareAtPrice !== null
            ? parseFloat(v.compareAtPrice)
            : null,
        inStock: v.inStock !== undefined ? !!v.inStock : true,
        stockNote: v.stockNote || '',
        image: v.image || null,
        isActive: v.isActive !== undefined ? !!v.isActive : true,
        attributes: v.attributes || {},
      }));

    // If variants exist and product is marked as having variants, derive product price
    const hasVars = updates.hasVariants !== undefined ? !!updates.hasVariants : true;
    if (hasVars && updates.variants.length > 0) {
      const activePrices = updates.variants.filter((v) => v.isActive).map((v) => Number(v.price || 0));
      if (activePrices.length > 0) updates.price = Math.min(...activePrices);
    }
  }

  if (updates.images !== undefined || updates.image !== undefined) {
    updates.images = normalizeProductImages(updates.images ?? updates.image);
    delete updates.image;
  }

  // Normalize SKU - only store if non-empty, otherwise leave as undefined
  if (updates.sku !== undefined) {
    updates.sku = updates.sku && String(updates.sku).trim() ? String(updates.sku).trim() : undefined;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('UpdateProduct Debug:', {
      productId: id,
      sku: updates.sku,
      updates: Object.keys(updates),
    });
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('category collection collections');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json(new ApiResponse(200, product, 'Product updated'));
});

export const publishProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // BUG FIX: was `!Product.isActive` (class); now `!product.isActive` (instance)
  const existing = await Product.findById(id);

  if (!existing) {
    throw new ApiError(404, 'Product not found');
  }

  existing.isActive = !existing.isActive;
  await existing.save();

  res.status(200).json(
    new ApiResponse(200, existing, `Product ${existing.isActive ? 'published' : 'unpublished'}`)
  );
});

export const updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { inStock, stockNote } = req.body;

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: { inStock, stockNote } },
    { new: true }
  );

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json(new ApiResponse(200, product, 'Stock updated'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json(new ApiResponse(200, {}, 'Product deleted'));
});

export const bulkUpdateProducts = asyncHandler(async (req, res) => {
  const { ids, action, value } = req.body;

  if (!ids || !action) {
    throw new ApiError(400, 'IDs and action are required');
  }

  let updateData = {};
  if (action === 'publish') updateData = { isActive: true };
  else if (action === 'unpublish') updateData = { isActive: false };
  else if (action === 'category') updateData = { category: value };

  if (action === 'delete') {
    await Product.deleteMany({ _id: { $in: ids } });
  } else {
    await Product.updateMany({ _id: { $in: ids } }, { $set: updateData });
  }

  res.status(200).json(new ApiResponse(200, {}, 'Bulk operation completed'));
});

export const duplicateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const newProduct = await Product.create({
    ...product.toObject(),
    _id: undefined,
    name: `${product.name} (Copy)`,
    slug: undefined, // let pre-save hook regenerate
    isActive: false,
  });

  res.status(201).json(new ApiResponse(201, newProduct, 'Product duplicated'));
});
