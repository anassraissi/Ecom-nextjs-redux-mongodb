import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: '',
  imgSrc: '',
  fileKey: '',
  name: '',
  description: '',
  price: 0,
  discountPrice: 0,
  stock: 0,
  category: '',
  brand: '',
  images: [],
  tags: [],
};

export const productSlice = createSlice({
  name: 'productSlice',
  initialState,
  reducers: {
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
      state.images.push(action.payload);
    },
    removeImage: (state, action) => {
      state.images = state.images.filter((_, index) => index !== action.payload);
    },

    removeProduct: (state) => {
      return initialState; // Reset to initial state when a product is removed
    },
  },
});

export const {
  setProduct,
  updateProduct,
  resetProduct,
  addImage,
  removeImage,
  removeProduct, // Export the new action
} = productSlice.actions;

export default productSlice.reducer;
