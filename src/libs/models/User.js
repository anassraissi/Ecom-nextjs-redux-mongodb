import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Core User Information (Required)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },

  // Core User Information (Optional)
  image: { type: String }, // Profile image URL
  emailVerified: { type: Date }, // Date email was verified
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Customer-Specific Details (Optional)
  customerDetails: {
    address: { type: String },
    phone: { type: String },
    preferredPayment: { type: String },
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Reference to Order model
    // Add more customer-related fields as needed
  },

  // Seller-Specific Details (Optional)
  sellerDetails: {
    businessName: { type: String },
    businessAddress: { type: String },
    businessPhone: { type: String },
    businessDescription: { type: String },
    taxId: { type: String },
    storeUrl: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Reference to Product model
    // Add more seller-related fields as needed
  },

  // Admin Specific Details (Optional)
  adminDetails: {
      lastLogin: {type: Date},
      permissions: [{type: String}]
  }

});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;