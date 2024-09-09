const mongoose = require('mongoose');
const BaseProduct = require('./baseModel'); // Import the base schema



// Define the Laptop schema that extends BaseProduct
const televisionSchema = new mongoose.Schema({
  screenSize: String,
  technology: String,
  resolution: String,
});

// Create the Laptop model using the discriminator method
const Television = BaseProduct.discriminator('Television', televisionSchema);

module.exports = Television
