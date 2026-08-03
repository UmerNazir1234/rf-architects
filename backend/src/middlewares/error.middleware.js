import { ApiError } from '../utils/apiError.js';

export const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, 'Validation Error', messages);
    
    // Log detailed validation errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ValidationError Details:', {
        fields: Object.keys(err.errors),
        errors: Object.entries(err.errors).map(([field, err]) => ({
          field,
          message: err.message,
          value: err.value,
        })),
      });
    }
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue?.[field] || 'unknown';
    
    let fieldLabel = field;
    if (field === 'sku') fieldLabel = 'SKU';
    else if (field === 'slug') fieldLabel = 'Product name/slug';
    
    const message = `${fieldLabel} "${value}" already exists`;
    error = new ApiError(409, message);
    
    if (process.env.NODE_ENV === 'development') {
      console.error('DuplicateKey Error:', {
        field,
        value,
        message,
      });
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token has expired');
  }

  // If it's not an ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const wrappedError = new ApiError(
      error.statusCode || 500,
      error.message || 'Internal Server Error'
    );
    wrappedError.stack = err.stack;
    error = wrappedError;
  }

  // Log error stack in dev
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
