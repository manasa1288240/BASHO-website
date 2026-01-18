const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        price: Number,
        qty: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    gstAmount: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
