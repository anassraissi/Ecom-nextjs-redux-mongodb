import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const createSale = createAsyncThunk(
  'sales/createSale',
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/sales/createSale', {
        method: 'POST',
        body: saleData, // Send FormData directly
      });
      if (!response.ok) {
        try {
          const errorData = await response.json();
          return rejectWithValue(errorData.message);
        } catch (parseError) {
          return rejectWithValue(`Server error: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSales = createAsyncThunk(
  'sales/getSales',
  async (params, { rejectWithValue }) => { // Accept params
    try {
      let url = '/api/sales/getSales';

      if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams(params);
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message);
      }

      const data = await response.json();
      return data.sales;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSaleAsync = createAsyncThunk(
  'sales/updateSale',
  async ({ id, saleData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/sales/updateSale/${id}`, saleData, { // Corrected URL
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteSale = createAsyncThunk(
  'sales/deleteSale',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/sales/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const saleSlice = createSlice({
  name: 'sales',
  initialState: {
    sales: [],
    salesTypeSale: [],
    salesTypeBanner: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSale.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSale.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createSale.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Determine which state slice to update based on the 'type' in the action meta
        if (action.meta.arg && action.meta.arg.type === 'sale') {
          state.salesTypeSale = action.payload;
        } else if (action.meta.arg && action.meta.arg.type === 'banner') {
          state.salesTypeBanner = action.payload;
        } else {
          state.sales = action.payload; // Fallback for general fetches if needed
        }
      })
      .addCase(getSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateSaleAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSaleAsync.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateSaleAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteSale.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSale.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default saleSlice.reducer;