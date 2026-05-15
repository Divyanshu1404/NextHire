export const buildRegexFilter = (value) => ({ $regex: value, $options: 'i' });

export const sanitizeMongoQuery = (query = {}) => {
  const sanitized = {};

  for (const [key, value] of Object.entries(query)) {
    if (key.startsWith('$') || key.includes('.')) continue;
    sanitized[key] = value;
  }

  return sanitized;
};
