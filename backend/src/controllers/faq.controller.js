import Faq from '../models/Faq.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// PUBLIC ROUTES

export const getPublicFaqs = asyncHandler(async (req, res) => {
  const faqs = await Faq.find({ isPublished: true }).sort({ order: 1, createdAt: 1 });

  res.status(200).json(new ApiResponse(200, faqs, 'FAQs retrieved'));
});

// ADMIN ROUTES

export const getAdminFaqs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const filter = {};
  if (status === 'published') filter.isPublished = true;
  else if (status === 'draft') filter.isPublished = false;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const faqs = await Faq.find(filter)
    .skip(skip)
    .limit(limitNum)
    .sort({ order: 1, createdAt: 1 });

  const total = await Faq.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        faqs,
        pagination: { total, pages: Math.ceil(total / limitNum), currentPage: pageNum },
      },
      'Admin FAQs retrieved'
    )
  );
});

export const createFaq = asyncHandler(async (req, res) => {
  const { question, answer, order } = req.body;

  if (!question || !answer) {
    throw new ApiError(400, 'Question and answer are required');
  }

  const faq = await Faq.create({
    question,
    answer,
    order: order || 0,
  });

  res.status(201).json(new ApiResponse(201, faq, 'FAQ created'));
});

export const updateFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const faq = await Faq.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!faq) {
    throw new ApiError(404, 'FAQ not found');
  }

  res.status(200).json(new ApiResponse(200, faq, 'FAQ updated'));
});

export const publishFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const faq = await Faq.findById(id);

  if (!faq) {
    throw new ApiError(404, 'FAQ not found');
  }

  faq.isPublished = !faq.isPublished;
  await faq.save();

  res.status(200).json(
    new ApiResponse(200, faq, `FAQ ${faq.isPublished ? 'published' : 'unpublished'}`)
  );
});

export const reorderFaqs = asyncHandler(async (req, res) => {
  const { order } = req.body; // Array of FAQ IDs

  if (!Array.isArray(order)) {
    throw new ApiError(400, 'Order must be an array of FAQ IDs');
  }

  const updatePromises = order.map((id, index) =>
    Faq.findByIdAndUpdate(id, { $set: { order: index } }, { new: true })
  );

  const updated = await Promise.all(updatePromises);

  res.status(200).json(new ApiResponse(200, updated, 'FAQs reordered'));
});

export const deleteFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const faq = await Faq.findByIdAndDelete(id);

  if (!faq) {
    throw new ApiError(404, 'FAQ not found');
  }

  res.status(200).json(new ApiResponse(200, {}, 'FAQ deleted'));
});
