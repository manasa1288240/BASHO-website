const express = require("express");
const Gallery = require("../models/Gallery");

const router = express.Router();

// GET all gallery images
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gallery images" });
  }
});

module.exports = router;
