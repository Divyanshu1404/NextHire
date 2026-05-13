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
      const err = new Error(message);
      err.statusCode = 400;
      return next(err);
    }
    error.statusCode = 400;
    next(error);
  }
};
