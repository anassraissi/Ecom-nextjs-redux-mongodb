// src/redux/slices/brandSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: '',
  name: '',
  description: '',
  logoUrl: '',
  categories: [], // Assuming categories is an array of ObjectIds
  createdAt: null,
  updatedAt: null,
};

export const brandSlice = createSlice({
  name: 'brandSlice',
  initialState,
  reducers: {
    setBrand: (state, action) => {
      return action.payload;
    },
    updateBrand: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetBrand: () => {
      return initialState;
    },
    removeBrand: () => {
      return initialState; // Reset to initial state when a brand is removed
    },
  },
});

export const {
  setBrand,
  updateBrand,
  resetBrand,
  removeBrand, // Export the new action
} = brandSlice.actions;

export default brandSlice.reducer;