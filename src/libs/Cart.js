// Node.js - models/Cart.js (using Mongoose)
import mongoose, { Schema } from 'mongoose';

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
    unique: true, // One cart per user
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;