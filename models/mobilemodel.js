const mongoose = require('mongoose');
const BaseProduct = require('./baseModel'); // Import the base schema


const mobileSchema = new mongoose.Schema({
  screenSize: { type: Number },
  batteryCapacity: { type: Number },
  cameraSpecs: { type: Number },
  storage: { type: Number },
});

const Mobile = BaseProduct.discriminator('Mobile', mobileSchema);

module.exports = Mobile;
