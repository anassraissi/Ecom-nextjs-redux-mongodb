// Node.js - models/CartItem.js (using Mongoose)
import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new Schema({
  cartId: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product', // Assuming you have a Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  priceAtTimeOfAddition: {
    type: Number,
    required: true,
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

const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);

export default CartItem;