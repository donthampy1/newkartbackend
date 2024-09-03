const mongoose = require('mongoose');
const BaseProduct = require('./baseModel'); // Import the base schema


const mobileSchema = new mongoose.Schema({
  screenSize: { type: String },
  batteryCapacity: { type: String },
  cameraSpecs: { type: String },
  storage: { type: String },
});

const Mobile = BaseProduct.discriminator('Mobile', mobileSchema);

module.exports = Mobile;
