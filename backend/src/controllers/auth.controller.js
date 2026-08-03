import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import jwt from 'jsonwebtoken';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated');
  }

  const { accessToken, refreshToken } = generateTokens(user);

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  res.cookie('accessToken', accessToken, {
    ...getCookieOptions(),
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie('refreshToken', refreshToken, {
    ...getCookieOptions(),
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(200).json(
    new ApiResponse(200, { 
      accessToken, 
      refreshToken, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      } 
    }, 'Login successful')
  );
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken', getCookieOptions());
  res.clearCookie('refreshToken', getCookieOptions());

  res.status(200).json(new ApiResponse(200, {}, 'Logout successful'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json(new ApiResponse(200, user, 'User data retrieved'));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(401, 'Refresh token is missing');
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  res.cookie('accessToken', accessToken, {
    ...getCookieOptions(),
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', newRefreshToken, {
    ...getCookieOptions(),
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Token refreshed')
  );
});
