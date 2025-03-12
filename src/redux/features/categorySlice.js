// src/redux/slices/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: '',
  name: '',
  description: '',
  imageUrl: '',
  parent: null, // Assuming parent is ObjectId or null
  createdAt: null,
  updatedAt: null,
};

export const categorySlice = createSlice({
  name: 'categorySlice',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      return action.payload;
    },
    updateCategory: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetCategory: () => {
      return initialState;
    },
    removeCategory: () => {
      return initialState; // Reset to initial state when a category is removed
    },
  },
});

export const {
  setCategory,
  updateCategory,
  resetCategory,
  removeCategory, // Export the new action
} = categorySlice.actions;

export default categorySlice.reducer;