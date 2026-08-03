import Category from '../models/Category.js';
import Collection from '../models/Collection.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// PUBLIC & SHARED ROUTES (No auth)

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ order: 1, createdAt: 1 });

  res.status(200).json(new ApiResponse(200, categories, 'Categories retrieved'));
});

// ADMIN ROUTES

export const createCategory = asyncHandler(async (req, res) => {
  const { name, order } = req.body;

  if (!name) {
    throw new ApiError(400, 'Category name is required');
  }

  const category = await Category.create({
    name,
    order: order || 0,
  });

  res.status(201).json(new ApiResponse(201, category, 'Category created'));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, order } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    { $set: { name, order } },
    { new: true, runValidators: true }
  );

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(200).json(new ApiResponse(200, category, 'Category updated'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if category is in use
  const collectionsCount = await Collection.countDocuments({ category: id });
  const productsCount = await Product.countDocuments({ category: id });

  if (collectionsCount > 0 || productsCount > 0) {
    throw new ApiError(409, 'Cannot delete category with active items');
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(200).json(new ApiResponse(200, {}, 'Category deleted'));
});

export const reorderCategories = asyncHandler(async (req, res) => {
  const { categories } = req.body;

  if (!Array.isArray(categories)) {
    throw new ApiError(400, 'Categories must be an array');
  }

  const updatePromises = categories.map((cat, index) =>
    Category.findByIdAndUpdate(cat._id, { $set: { order: index } }, { new: true })
  );

  const updated = await Promise.all(updatePromises);

  res.status(200).json(new ApiResponse(200, updated, 'Categories reordered'));
});
