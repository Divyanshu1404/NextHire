import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import jobReducer from './slices/jobSlice';
import companyReducer from './slices/companySlice';
import applicationReducer from './slices/applicationSlice';
import adminReducer from './slices/adminSlice';
import requestReducer from './slices/requestSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    jobs: jobReducer,
    company: companyReducer,
    applications: applicationReducer,
    admin: adminReducer,
    request: requestReducer,
  },
});

export default store;
