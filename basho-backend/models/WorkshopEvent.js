const mongoose = require("mongoose");

const workshopEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    category: { type: String, required: true },
    capacity: { type: Number, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkshopEvent", workshopEventSchema);
