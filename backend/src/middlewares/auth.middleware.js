import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Access token is missing');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decodedToken._id);
    
    if (!user) {
      throw new ApiError(401, 'Invalid access token - User not found');
    }
    
    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, error?.message || 'Invalid or expired token'));
    }
  }
};
