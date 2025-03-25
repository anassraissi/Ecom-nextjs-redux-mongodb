import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  originalPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  image: { type: String, required: true },
  saleStartDate: { type: Date },
  saleEndDate: { type: Date },
  title: { type: String, required: true },
  description: { type: String },
  occasion: { type: String },
  type: { type: String, enum: ['sale', 'banner'], required: true },
  couponCode: { type: String },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
  saleType: { type: String, enum: ['Discount', 'Pre-Order', 'Bundle', 'Flash Sale'] },
  priority: { type: Number, default: 0 },
  stockQuantity: { type: Number },
  usageLimit: { type: Number },
  usageCount: { type: Number, default: 0 },
  bonus: {
    bonusTitle: { type: String }, // General title for the bonus
    bonusDescription: { type: String }, // Detailed description of the bonus
    // Consider adding more general bonus fields if needed
  },
  termsAndConditions: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Sale = mongoose.models.Sale || mongoose.model('Sale', saleSchema);

export default Sale;