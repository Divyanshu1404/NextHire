import { createAsyncThunk } from '@reduxjs/toolkit';
import { jobsAPI } from '../../services/api';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getAllJobs(filters);
      return response.data.data.jobs || response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getJobById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.postJob(jobData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.updateJob(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await jobsAPI.deleteJob(id);
      return id;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const fetchCompanyJobs = createAsyncThunk(
  'jobs/fetchCompanyJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getCompanyJobs();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);
