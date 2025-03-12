// src/libs/models/Sale.js
import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Products included in the sale
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Categories included in the sale
  couponCode: { type: String, unique: true }, // Optional coupon code
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Sale || mongoose.model('Sale', SaleSchema);