import { useState } from 'react';

export const useApiRequest = (requestFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      return await requestFn(...args);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, setError };
};
