const express = require("express");
const WorkshopEvent = require("../models/WorkshopEvent");

const router = express.Router();

// GET all workshop events
router.get("/", async (req, res) => {
  try {
    const workshops = await WorkshopEvent.find().sort({ date: 1 });
    res.json({ success: true, workshops });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE workshop event
router.post("/", async (req, res) => {
  try {
    const { title, description, date, price, image, category, capacity } =
      req.body;

    if (!title || !date || !price || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const workshop = await WorkshopEvent.create({
      title,
      description,
      date,
      price,
      image,
      category,
      capacity,
    });

    res.status(201).json({ success: true, workshop });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE workshop event
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await WorkshopEvent.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    res.json({ success: true, message: "Workshop deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
