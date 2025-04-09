import mongoose from 'mongoose';

// Image Sub-Schema (unchanged)
const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  color: { type: String }, // Optional color field
});

// Product Schema (focused on core + variants/tech specs)
const ProductSchema = new mongoose.Schema({
  // 1. Core Identity Fields
  name: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // 2. Media & Organization
  images: [ImageSchema],
  tags: [{ type: String }],
  slug: { type: String, unique: true }, // SEO-friendly URL (e.g., "samsung-galaxy-s24-ultra")

  // 3. Technical Details
  specifications: {
    type: [{
      key: String,
      value: mongoose.Schema.Types.Mixed,
      valueType: String
    }],
    default: []
  },
  variants: [{
    color: String,
    storage: String,
    price: Number, // Overrides main price if set
    stock: Number,
    sku: { type: String, unique: true }, // e.g., "S24U-BLK-256"
  }],
  manufactureYear: { type: Number },

  // 4. Logistics
  weight: Number, // grams/kg
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  warranty: { type: String, default: "1-year warranty" },

  // 5. Analytics (optional)
  views: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },

  // 6. Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Prevent model overwrite
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;