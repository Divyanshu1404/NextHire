import { AppError } from '../utils/appError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const issues = error.issues || error.errors;
    if (issues && Array.isArray(issues)) {
      const message = issues.map(err => err.message).join(', ');
      return next(new AppError(message, 400));
    }
    return next(new AppError(error.message || 'Validation failed', 400));
  }
};
