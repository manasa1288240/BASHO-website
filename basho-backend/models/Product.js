const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: String,
    description: String,
    images: [String],
    isCustomisable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
