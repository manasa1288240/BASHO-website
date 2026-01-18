const mongoose = require("mongoose");

const videoTestimonialSchema = new mongoose.Schema(
  {
    reelUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VideoTestimonial", videoTestimonialSchema);
