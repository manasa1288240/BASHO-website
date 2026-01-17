const express = require("express");
const Testimonial = require("../models/Testimonial");

const router = express.Router();

// GET all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ADD testimonial
router.post("/", async (req, res) => {
  try {
    const { name, role, message, rating, image } = req.body;

    if (!name || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Name and message are required" });
    }

    const testimonial = await Testimonial.create({
      name,
      role,
      message,
      rating,
      image,
    });

    res.status(201).json({ success: true, testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE testimonial
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    res.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
