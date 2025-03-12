import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  logoUrl: { type: String },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Relationship
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);