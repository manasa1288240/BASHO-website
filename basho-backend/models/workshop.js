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
  message: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Workshop", workshopSchema);
