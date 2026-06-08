import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../services/api';

export const fetchAllCompanies = createAsyncThunk(
  'admin/fetchAllCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllCompanies();
      return response.data.data.companies || response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const updateKYCStatus = createAsyncThunk(
  'admin/updateKYCStatus',
  async ({ companyId, status }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateKYCStatus(companyId, status);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'admin/deleteCompany',
  async (companyId, { rejectWithValue }) => {
    try {
      await adminAPI.deleteCompany(companyId);
      return companyId;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);
