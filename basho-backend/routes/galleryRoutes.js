const express = require("express");
const Gallery = require("../models/Gallery");
const router = express.Router();

/* -------- GET ALL -------- */
router.get("/", async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

/* -------- POST -------- */
router.post("/", async (req, res) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json(item);
  } catch {
    res.status(400).json({ error: "Failed to add image" });
  }
});

/* -------- DELETE -------- */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
