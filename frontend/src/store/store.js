import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import requestReducer from '../redux/slices/requestSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    request: requestReducer,
  },
});

export default store;
