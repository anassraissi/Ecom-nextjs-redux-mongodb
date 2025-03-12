// src/redux/features/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Initially, no user is logged in
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Set the user object
    },
    clearUser: (state) => {
      state.user = null; // Clear the user (e.g., on logout)
    },

    updateCustomerDetails: (state, action) => {
      if (state.user && state.user.customerDetails) {
        state.user.customerDetails = {
          ...state.user.customerDetails,
          ...action.payload,
        };
      }
    },
    updateSellerDetails: (state, action) => {
      if (state.user && state.user.sellerDetails) {
        state.user.sellerDetails = {
          ...state.user.sellerDetails,
          ...action.payload,
        };
      }
    },
    updateAdminDetails: (state, action) => {
      if (state.user && state.user.adminDetails) {
        state.user.adminDetails = {
          ...state.user.adminDetails,
          ...action.payload,
        };
      }
    }
  },
});

export const {
  setUser,
  clearUser,
  updateCustomerDetails,
  updateSellerDetails,
  updateAdminDetails
} = userSlice.actions;

// Selectors to get user information (useful in components)
export const selectUser = (state) => state.user.user;
export const selectCustomerDetails = (state) => state.user.user?.customerDetails;
export const selectSellerDetails = (state) => state.user.user?.sellerDetails;
export const selectAdminDetails = (state) => state.user.user?.adminDetails;

export default userSlice.reducer;