const mongoose = require('mongoose');
const BaseProduct = require('./baseModel'); // Import the base schema



// Define the Laptop schema that extends BaseProduct
const laptopSchema = new mongoose.Schema({
  screenSize: String,
  ram: String,
  storage: String,
  processor: String,
  graphicsCard:String,
});

// Create the Laptop model using the discriminator method
const Laptop = BaseProduct.discriminator('Laptop', laptopSchema);

module.exports = Laptop;
