import { createSlice } from '@reduxjs/toolkit';
import { fetchAllCompanies, updateKYCStatus, deleteCompany } from '../thunks/adminThunks';

const initialState = {
  allCompanies: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch All Companies
    builder
      .addCase(fetchAllCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.allCompanies = action.payload;
      })
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update KYC Status
    builder
      .addCase(updateKYCStatus.fulfilled, (state, action) => {
        const index = state.allCompanies.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.allCompanies[index] = action.payload;
        }
      });

    // Delete Company
    builder
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.allCompanies = state.allCompanies.filter(c => c._id !== action.payload);
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
