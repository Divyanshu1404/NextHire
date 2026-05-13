import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { authAPI } from './services/api';
import { setUser, logout } from './store/slices/authSlice';
import Loader from './components/ui/Loader';

function App() {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await authAPI.getCurrentUser();
        console.log('Auth Re-hydration successful:', response.data.data);
        dispatch(setUser(response.data.data));
      } catch (error) {
        console.error('Auth Re-hydration failed:', error.response?.data || error.message);
        dispatch(logout());
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
    
  }, [dispatch]); 

  if (isInitializing) {
    return <Loader fullScreen />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
