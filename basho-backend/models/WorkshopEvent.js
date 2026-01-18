const mongoose = require("mongoose");

const workshopEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      default: "Flexible",
    },

    duration: {
      type: String,
      default: "2 hrs",
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkshopEvent", workshopEventSchema);
