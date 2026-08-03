import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// ADMIN ROUTES (superadmin only)

export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;

  const filter = {};

  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find(filter)
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 })
    .select('-passwordHash');

  const total = await User.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: { total, pages: Math.ceil(total / limitNum), currentPage: pageNum },
      },
      'Users retrieved'
    )
  );
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    throw new ApiError(400, 'Name, email, role, and password are required');
  }

  if (!['superadmin', 'editor', 'viewer'].includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
    role,
    createdBy: req.user._id,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdBy: user.createdBy,
        },
      },
      'User created successfully'
    )
  );
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, role, isActive } = req.body;

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (role !== undefined) updateFields.role = role;
  if (isActive !== undefined) updateFields.isActive = isActive;

  const user = await User.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select('-passwordHash');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(new ApiResponse(200, user, 'User updated'));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent deleting yourself
  if (req.user._id.toString() === id) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(new ApiResponse(200, {}, 'User deleted'));
});
