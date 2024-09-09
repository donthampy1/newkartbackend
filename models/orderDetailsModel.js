const mongoose = require("mongoose");

const orderDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        productName: { type: String, required: true },
        productThumbnail: { type: String, required: true },
        sellerId: { type: mongoose.Schema.Types.ObjectId,  },
        productPrice: { type: Number, required: true },
        category: { type: String }
      },  
    ],
    totalPrice: {
      type: Number,
    },
    shippingDetails: {
      firstName: { type: String },
      lastName: { type: String },
      streetAddress: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String },
      phoneNumber: { type: String },
      email: { type: String },
    },
    orderStatus: {
      type: String,
      enum: ["Pending","Processing" ,"Shipped", "Delivered"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    paymentId: { type: String,  },

    deliveryDate: { type: Date },
    
    message:{ type: String }
  },
  { timestamps: true }
);

const OrderDetails = mongoose.model("OrderDetails", orderDetailsSchema);

module.exports = OrderDetails;
