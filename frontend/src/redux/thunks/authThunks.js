import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

export const loginUser = createAsyncThunk('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(payload);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || error.message);
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await authAPI.register(payload);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || error.message);
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const response = await authAPI.getCurrentUser();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || error.message);
  }
});
