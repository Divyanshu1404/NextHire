import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../store/thunks/authThunks';
import { getToken } from '../utils/storage';

export const useAuthBootstrap = () => {
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        await dispatch(fetchCurrentUser()).unwrap();
      } catch {
        // Error handling is managed by extraReducers in authSlice
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  return initializing;
};
