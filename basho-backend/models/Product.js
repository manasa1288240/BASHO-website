const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: String,
    stock: {
      type: Number,
      default: 0
    },
    gstPercent: {
      type: Number,
      default: 18
    },
    images: [String],
    isCustomisable: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
