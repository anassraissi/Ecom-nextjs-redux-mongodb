import mongoose from 'mongoose';

// Define Image Schema
const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  color: { type: String }, // Optional color field
});

// Define Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number },
  discountPrice: { type: Number },
  stock: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Relationship
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }, // Relationship
  manufactureYear: { type: Number },
  images: [ImageSchema], // Use ImageSchema for structured image data
  tags: [{ type: String }], // Define as an array of strings
  views: { type: Number, default: 0 }, // For tracking views
  sold: { type: Number, default: 0 }, // For tracking sales
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Add userID field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Check if the model already exists
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;