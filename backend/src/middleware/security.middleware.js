const requestBuckets = new Map();

const CLEAN_KEYS = ['$', '.'];

export const rateLimit = ({ windowMs = 60_000, max = 100 } = {}) => {
  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'anonymous';
    const now = Date.now();
    const bucket = requestBuckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    requestBuckets.set(key, bucket);

    if (bucket.count > max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    return next();
  };
};

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, nestedValue]) => {
      if (CLEAN_KEYS.some((char) => key.includes(char))) return acc;
      acc[key] = sanitizeValue(nestedValue);
      return acc;
    }, {});
  }

  return value;
};

export const sanitizeRequest = (req, res, next) => {
  req.body = sanitizeValue(req.body);
  const sanitizedQuery = sanitizeValue(req.query);
  if (req.query && typeof req.query === 'object' && sanitizedQuery && typeof sanitizedQuery === 'object') {
    Object.keys(req.query).forEach((k) => {
      if (!(k in sanitizedQuery)) delete req.query[k];
    });
    Object.keys(sanitizedQuery).forEach((k) => {
      req.query[k] = sanitizedQuery[k];
    });
  } else {
    req._sanitizedQuery = sanitizedQuery;
  }
  req.params = sanitizeValue(req.params);
  next();
};

export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
};
