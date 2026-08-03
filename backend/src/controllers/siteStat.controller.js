import SiteStat from '../models/SiteStat.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// PUBLIC & SHARED ROUTES

export const getSiteStats = asyncHandler(async (req, res) => {
  const stats = await SiteStat.find();

  res.status(200).json(new ApiResponse(200, stats, 'Site stats retrieved'));
});

// ADMIN ROUTES

export const updateSiteStat = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value, label, sublabel } = req.body;

  if (!value) {
    throw new ApiError(400, 'Value is required');
  }

  const stat = await SiteStat.findOneAndUpdate(
    { key },
    { $set: { value, label, sublabel } },
    { new: true, runValidators: true, upsert: true }
  );

  res.status(200).json(new ApiResponse(200, stat, 'Site stat updated'));
});
