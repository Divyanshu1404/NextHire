import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchJobs, 
  fetchJobById, 
  createJob, 
  updateJob, 
  deleteJob, 
  fetchCompanyJobs 
} from '../thunks/jobThunks';

const initialState = {
  jobs: [],
  selectedJob: null,
  companyJobs: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch All Jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Job By ID
    builder
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Job
    builder
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Job
    builder
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.selectedJob?._id === action.payload._id) {
          state.selectedJob = action.payload;
        }
      });

    // Delete Job
    builder
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
        state.companyJobs = state.companyJobs.filter(job => job._id !== action.payload);
      });

    // Fetch Company Jobs
    builder
      .addCase(fetchCompanyJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.companyJobs = action.payload;
      })
      .addCase(fetchCompanyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearJobError, setSelectedJob } = jobSlice.actions;
export default jobSlice.reducer;
