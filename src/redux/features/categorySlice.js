import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  categories: [], // Add categories array
  _id: '',
  name: '',
  description: '',
  imageUrl: '',
  parent: null,
  createdAt: null,
  updatedAt: null,
  loading: false, // Add loading state
  error: null, // Add error state
};

export const fetchCategories = createAsyncThunk(
  'categorySlice/fetchCategories',
  async () => {
    try {
      const response = await axios.get('/api/category/getCategories'); // Assuming you have an endpoint for categories
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

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
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setCategory,
  updateCategory,
  resetCategory,
  removeCategory,
} = categorySlice.actions;

export default categorySlice.reducer;