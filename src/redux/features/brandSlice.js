import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  brands: [], // Add brands array
  _id: '',
  name: '',
  description: '',
  logoUrl: '',
  categories: [],
  createdAt: null,
  updatedAt: null,
  loading: false, // Add loading state
  error: null, // Add error state
};

export const fetchBrands = createAsyncThunk(
  'brandSlice/fetchBrands',
  async () => {
    try {
      const response = await axios.get('/api/brand/getBrands'); // Assuming you have an endpoint for brands 
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

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
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setBrand,
  updateBrand,
  resetBrand,
  removeBrand,
} = brandSlice.actions;

export default brandSlice.reducer;