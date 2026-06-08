import { createAsyncThunk } from '@reduxjs/toolkit';
import { companyAPI } from '../../services/api';

export const fetchApprovedCompanies = createAsyncThunk(
  'company/fetchApproved',
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getAllApprovedCompanies();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const registerCompany = createAsyncThunk(
  'company/register',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await companyAPI.registerCompany(companyData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const fetchCompanyDetails = createAsyncThunk(
  'company/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getCompanyDetails(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const fetchCompanyStats = createAsyncThunk(
  'company/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getCompanyStats();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const fetchCompanyTeam = createAsyncThunk(
  'company/fetchTeam',
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getCompanyTeam();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const addTeamMember = createAsyncThunk(
  'company/addTeamMember',
  async (memberData, { rejectWithValue }) => {
    try {
      const response = await companyAPI.addTeamMember(memberData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  'company/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await companyAPI.updateCompany(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);
