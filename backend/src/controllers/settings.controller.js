import Settings from '../models/Settings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// PUBLIC & SHARED ROUTES

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  res.status(200).json(new ApiResponse(200, settings, 'Settings retrieved'));
});

// ADMIN ROUTES (superadmin only)

export const updateSettings = asyncHandler(async (req, res) => {
  const { phone, email, address, social, seo } = req.body;

  let settings = await Settings.findOne();

  if (!settings) {
    settings = new Settings();
  }

  settings.phone = phone || settings.phone;
  settings.email = email || settings.email;
  settings.address = address || settings.address;

  if (social) {
    settings.social = {
      ...settings.social,
      ...social,
    };
  }

  if (seo) {
    settings.seo = {
      ...settings.seo,
      ...seo,
    };
  }

  await settings.save();

  res.status(200).json(new ApiResponse(200, settings, 'Settings updated'));
});
