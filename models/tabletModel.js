const mongoose = require('mongoose');
const BaseProduct = require('./baseModel'); // Import the base schema



// Define the Laptop schema that extends BaseProduct
const tabletSchema = new mongoose.Schema({
  screenSize: String,
  ram: String,
  storage: String,

});

// Create the Laptop model using the discriminator method
const Tablet = BaseProduct.discriminator('Tablet', tabletSchema);

module.exports = Tablet;
