import { createAsyncThunk } from '@reduxjs/toolkit';
import { applicationAPI } from '../../services/api';

export const applyToJob = createAsyncThunk(
  'applications/apply',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await applicationAPI.applyToJob(applicationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationAPI.getMyApplications();
      return response.data.data.applications || response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  'applications/fetchByJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await applicationAPI.getJobApplications(jobId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const fetchCompanyApplications = createAsyncThunk(
  'applications/fetchByCompany',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationAPI.getCompanyApplications();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await applicationAPI.updateApplicationStatus(id, status);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const sendAssessment = createAsyncThunk(
  'applications/sendAssessment',
  async ({ id, assessmentLink }, { rejectWithValue }) => {
    try {
      const response = await applicationAPI.sendAssessmentLink(id, assessmentLink);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);
