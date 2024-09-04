const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [
    {
      sellerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Seller' },
      productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
      productName: { type: String, required: true },
      productThumbnail: { type: String, required: true },
      productPrice: { type: Number, required: true },
      quantity: { type: Number, default : 1 },
    },
  ], 
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart