import { error as logError } from '../utils/logger.js';

const normalizeError = (err) => {
  if (err?.name === 'ValidationError') {
    return {
      statusCode: 400,
      message: err.message || 'Validation failed',
    };
  }

  if (err?.name === 'CastError') {
    return {
      statusCode: 400,
      message: 'Invalid resource identifier',
    };
  }

  return {
    statusCode: err?.statusCode || err?.status || 500,
    message: err?.message || 'Server Error',
  };
};

export const errorHandler = (err, req, res, next) => {
  logError(err);

  if (res.headersSent) {
    return next(err);
  }

  const normalized = normalizeError(err);
  const stack = process.env.NODE_ENV === 'production' ? null : err?.stack;

  return res.status(normalized.statusCode).json({
    success: false,
    message: normalized.message,
    stack,
  });
};
