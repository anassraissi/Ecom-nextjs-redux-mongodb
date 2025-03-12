// src/libs/models/Category.js
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
mongoose.models = {}; // add this line.
export default mongoose.models.Category || mongoose.model('Category', CategorySchema);