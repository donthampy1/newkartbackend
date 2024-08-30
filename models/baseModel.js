const mongoose = require('mongoose');

const baseProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameLower:{ type: String },
  brand: { type: String }, 
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  stock: { type: Number, required: true },
  category:{ type: String, required: true },
  rating: { type: Number ,default : 0}

}, { discriminatorKey: 'category', timestamps: true });

const BaseProduct = mongoose.model('Product', baseProductSchema);

module.exports = BaseProduct;

 