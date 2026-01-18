const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || !review) {
      return res
        .status(400)
        .json({ success: false, message: "Rating and review are required" });
    }

    const saved = await Review.create({ rating, review });

    res.status(201).json({ success: true, message: "Review saved", saved });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
