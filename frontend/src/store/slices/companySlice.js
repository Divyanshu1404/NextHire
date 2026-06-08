import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchApprovedCompanies, 
  registerCompany, 
  fetchCompanyDetails, 
  fetchCompanyStats, 
  fetchCompanyTeam, 
  addTeamMember,
  updateCompany
} from '../thunks/companyThunks';

const initialState = {
  companies: [],
  selectedCompany: null,
  companyStats: null,
  team: [],
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Approved Companies
    builder
      .addCase(fetchApprovedCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApprovedCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchApprovedCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Company Details
    builder
      .addCase(fetchCompanyDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompany = action.payload;
      })
      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Company Stats
    builder
      .addCase(fetchCompanyStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.companyStats = action.payload;
      })
      .addCase(fetchCompanyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Company Team
    builder
      .addCase(fetchCompanyTeam.fulfilled, (state, action) => {
        state.team = action.payload;
      });

    // Add Team Member
    builder
      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.team.unshift(action.payload);
      });

    // Update Company
    builder
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.selectedCompany = action.payload;
        const index = state.companies.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      });
  },
});

export const { clearCompanyError } = companySlice.actions;
export default companySlice.reducer;
