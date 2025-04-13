import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  selectedProduct: null,
  relatedProducts: [],
  loading: false,
  loadingRelated: false,
  error: null,
  errorRelated: null,
};

// Helper function for API error handling
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with a status code outside 2xx range
    return error.response.data.message || error.response.statusText;
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error - no response from server';
  }
  // Something happened in setting up the request
  return error.message || 'Unknown error occurred';
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/products/get_products');
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ categoryId, excludeId }, { rejectWithValue }) => {
    try {
      const params = excludeId ? { excludeId } : {};
      const { data } = await axios.get(
        `/api/products/getProductsByCategory/${categoryId}`,
        { params }
      );
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch single product by ID
export const fetchProductBySlug = createAsyncThunk(
  'products/fetchBySlug',
  async (slug, { rejectWithValue }) => {
      try {
          const { data } = await axios.get(`/api/products/getProductBySlug/${slug}`);
          return data;
      } catch (error) {
          return rejectWithValue(handleApiError(error));
      }
  }
);
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/getProductById/${productId}`);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    updateProduct: (state, action) => {
      if (state.selectedProduct) {
        state.selectedProduct = { ...state.selectedProduct, ...action.payload };
      }
    },
    resetProductState: () => initialState,
    addImage: (state, action) => {
      const { productId, image } = action.payload;
      const product = state.products.find(p => p._id === productId);
      if (product) {
        product.images.push(image);
      }
      if (state.selectedProduct?._id === productId) {
        state.selectedProduct.images.push(image);
      }
    },
    removeImage: (state, action) => {
      const { productId, imageUrl } = action.payload;
      state.products = state.products.map(product => 
        product._id === productId
          ? {
              ...product,
              images: product.images.filter(img => img.url !== imageUrl)
            }
          : product
      );
      
      if (state.selectedProduct?._id === productId) {
        state.selectedProduct.images = state.selectedProduct.images.filter(
          img => img.url !== imageUrl
        );
      }
    },
    deleteProduct: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter(product => product._id !== productId);
      if (state.selectedProduct?._id === productId) {
        state.selectedProduct = null;
      }
    },
    incrementProductViews: (state) => {
      if (state.selectedProduct) {
        state.selectedProduct.views = (state.selectedProduct.views || 0) + 1;
      }
    },
    clearRelatedProducts: (state) => {
      state.relatedProducts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loadingRelated = true;
        state.errorRelated = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loadingRelated = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loadingRelated = false;
        state.errorRelated = action.payload;
      })
          // Fetch product by ID
          .addCase(fetchProductById.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchProductById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedProduct = action.payload;
          })
          .addCase(fetchProductById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
      
     // Fetch product by Slug
     .addCase(fetchProductBySlug.pending, (state) => {
      state.loading = true;
      state.error = null;
  })
  .addCase(fetchProductBySlug.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
  })
  .addCase(fetchProductBySlug.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
  })
  }
});

export const {
  setProducts:setProduct ,
  setSelectedProduct,
  updateProduct,
  resetProductState,
  addImage,
  removeImage,
  deleteProduct: removeProduct ,
  incrementProductViews,
  clearRelatedProducts
} = productSlice.actions;

export const selectAllProducts = (state) => state.products.products;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectRelatedProducts = (state) => state.products.relatedProducts;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

export default productSlice.reducer;