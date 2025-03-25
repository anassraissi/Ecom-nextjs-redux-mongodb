// store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import loadingReducer from "./features/loadingSlice"; // Fixed naming convention
import productReducer from "./features/productSlice";
import userReducer from "./features/userSlice";
import categoryReducer from "./features/categorySlice";
import brandReducer from "./features/brandSlice";
import reviewReducer from "./features/reviewSlice";
import saleReducer from "./features/saleSlice";



export const store = configureStore({
  reducer: {
    cartReducer, // Use keys without "Reducer" suffix for better clarity
     products:productReducer,
     loadingReducer,
     userReducer,
    categories : categoryReducer,
     brands: brandReducer,
     reviews: reviewReducer, // Here, the reducer is named 'reviews'
     sales: saleReducer
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
