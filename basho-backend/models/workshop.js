const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  workshopType: {
    type: String,
    required: true
  },
  preferredDate: {
    type: String,
    required: true
  },
  participants: {
    type: Number,
    default: 1
  },
  message: {
    type: String
  },
  paymentId: {
    type: String
  },
  orderId: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Workshop", workshopSchema);
