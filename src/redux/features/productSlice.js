import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
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

export const productSlice = createSlice({
  name: 'productSlice',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProduct: (state, action) => {
      return action.payload;
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
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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

export default productSlice.reducer;