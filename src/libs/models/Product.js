import mongoose from 'mongoose';

// Define Image Schema
const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  altText: { type: String, required: true },
  color: { type: String } // Optional color field
});

// Check if the model already exists
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number },
  discountPrice: { type: Number },
  stock: { type: Number },
  category: { type: String },
  brand: { type: String },
  images: [ImageSchema], // Use ImageSchema for structured image data
  tags: [{ type: String }], // Define as an array of strings
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}));

export default Product;
