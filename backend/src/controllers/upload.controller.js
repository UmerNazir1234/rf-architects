import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';

// ─── Single image upload ──────────────────────────────────────────────────────
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const result = await uploadToCloudinary(req.file);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
      'Image uploaded successfully'
    )
  );
});

// ─── Multi-image upload ───────────────────────────────────────────────────────
export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'No files uploaded');
  }

  const results = await Promise.all(
    req.files.map((file) => uploadToCloudinary(file))
  );

  const images = results.map((result, index) => ({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    position: index,
    isFeatured: index === 0, // First image is featured by default
  }));

  res.status(200).json(
    new ApiResponse(200, images, `${images.length} image(s) uploaded successfully`)
  );
});

// ─── Single image delete ──────────────────────────────────────────────────────
export const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    throw new ApiError(400, 'Public ID is required');
  }

  await deleteFromCloudinary(publicId);

  res.status(200).json(new ApiResponse(200, {}, 'Image deleted successfully'));
});

// ─── Bulk image delete ────────────────────────────────────────────────────────
export const deleteImages = asyncHandler(async (req, res) => {
  const { publicIds } = req.body;

  if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
    throw new ApiError(400, 'publicIds array is required');
  }

  await Promise.all(publicIds.map((pid) => deleteFromCloudinary(pid)));

  res.status(200).json(
    new ApiResponse(200, {}, `${publicIds.length} image(s) deleted successfully`)
  );
});
