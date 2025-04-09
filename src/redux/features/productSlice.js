import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  selectedProduct: null, // To hold the fetched product by ID
  relatedProducts: [],
  _id: '',
  name: '',
  description: '',
  price: 0,
  discountPrice: 0,
  stock: 0,
  category: null,
  brand: null,
  manufactureYear: null,
  images: [],
  tags: [],
  views: 0,
  sold: 0,
  userID: null,
  createdAt: null,
  updatedAt: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'productSlice/fetchProducts',
  async () => {
    try {
      const response = await axios.get('/api/products/get_products');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'productSlice/fetchProductsByCategory',
  async ({ categoryId, excludeId }) => { // Expect an object with categoryId and excludeId
    try {
      let url = `/api/products/getProductsByCategory/${categoryId}`;
      if (excludeId) {
        url += `?excludeId=${excludeId}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'productSlice/fetchProductById',
  async (productId) => {
    try {
      const response = await axios.get(`/api/products/getProductById/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const productSlice = createSlice({
  name: 'productSlice',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    updateProduct: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetProduct: () => {
      return initialState;
    },
    addImage: (state, action) => {
      const { productId, ...newImage } = action.payload;
      const productIndex = state.products.findIndex(
        (product) => product._id === productId
      );

      if (productIndex !== -1) {
        return {
          ...state,
          products: state.products.map((product, index) =>
            index === productIndex
              ? {
                  ...product,
                  images: [...product.images, newImage],
                }
              : product
          ),
        };
      } else {
        return state;
      }
    },
    removeImage: (state, action) => {
      const { productId, imageUrl } = action.payload;
      const productIndex = state.products.findIndex(
        (product) => product._id === productId
      );

      if (productIndex !== -1) {
        state.products[productIndex].images = state.products[
          productIndex
        ].images.filter((image) => image.url !== imageUrl);
      }
    },
    removeProduct: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter((product) => product._id !== productId);
    },
    incrementViews: (state) => {
      state.views += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null; // Clear selected product on load
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.products = [];
        state.selectedProduct = null;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loadingRelated = true;
        state.errorRelated = null;
        state.relatedProducts = [];
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loadingRelated = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loadingRelated = false;
        state.errorRelated = action.error.message;
        state.relatedProducts = [];
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.selectedProduct = null;
      });
  },
});

export const {
  setProducts,
  setProduct,
  updateProduct,
  resetProduct,
  addImage,
  removeImage,
  removeProduct,
  incrementViews,
} = productSlice.actions;

export const selectSelectedProduct = (state) => state.productSlice;

export default productSlice.reducer;