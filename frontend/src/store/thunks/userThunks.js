import { createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../services/api';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getProfile();
      return response.data.data.user || response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateProfile(profileData);
      return response.data.data.user || response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);
