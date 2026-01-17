const express = require("express");
const VideoTestimonial = require("../models/VideoTestimonial");

const router = express.Router();

/* -------------------- GET ALL REELS -------------------- */
router.get("/", async (req, res) => {
  try {
    const reels = await VideoTestimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, reels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* -------------------- ADD REEL -------------------- */
router.post("/", async (req, res) => {
  try {
    const { reelUrl, title } = req.body;

    if (!reelUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Reel URL is required" });
    }

    const reel = await VideoTestimonial.create({
      reelUrl,
      title,
    });

    res.status(201).json({ success: true, reel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* -------------------- DELETE REEL -------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await VideoTestimonial.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Reel not found" });
    }

    res.json({ success: true, message: "Reel deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
