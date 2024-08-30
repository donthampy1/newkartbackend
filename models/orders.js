const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
      productName: { type: String, required: true },
      productThumbnail: { type: String, required: true },
      productPrice: { type: Number, required: true },
      quantity: { type: Number, default : 1 },
    },
  ], 
}, { timestamps: true });

const Order = mongoose.model('Cart', orderSchema);

module.exports = Order