import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relationship with User
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Relationship with Product
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);