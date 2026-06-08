import { createSlice } from '@reduxjs/toolkit';
import { 
  applyToJob, 
  fetchMyApplications, 
  fetchJobApplications, 
  fetchCompanyApplications, 
  updateApplicationStatus, 
  sendAssessment 
} from '../thunks/applicationThunks';

const initialState = {
  myApplications: [],
  jobApplications: [],
  companyApplications: [],
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearApplicationError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Apply To Job
    builder
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications.push(action.payload);
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch My Applications
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Job Applications
    builder
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.jobApplications = action.payload;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Company Applications
    builder
      .addCase(fetchCompanyApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.companyApplications = action.payload;
      })
      .addCase(fetchCompanyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Application Status
    builder
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const updateInList = (list) => {
          const index = list.findIndex(app => app._id === action.payload._id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };
        updateInList(state.jobApplications);
        updateInList(state.companyApplications);
        updateInList(state.myApplications);
      });

    // Send Assessment
    builder
      .addCase(sendAssessment.fulfilled, (state, action) => {
        const updateInList = (list) => {
          const index = list.findIndex(app => app._id === action.payload._id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };
        updateInList(state.jobApplications);
        updateInList(state.companyApplications);
      });
  },
});

export const { clearApplicationError } = applicationSlice.actions;
export default applicationSlice.reducer;
