import { ApiError } from '../utils/apiError.js';

export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to access this resource');
    }

    next();
  };
};
