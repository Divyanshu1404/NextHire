import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authAPI } from '../services/api';
import { setUser, logout } from '../store/slices/authSlice';
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
        const response = await authAPI.getCurrentUser();
        dispatch(setUser(response.data.data));
      } catch {
        dispatch(logout());
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  return initializing;
};
