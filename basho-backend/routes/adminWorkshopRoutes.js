const express = require("express");
const router = express.Router();
const WorkshopEvent = require("../models/WorkshopEvent");
const adminAuth = require("../middleware/adminAuth");

// GET all workshop events
router.get("/", adminAuth, async (req, res) => {
  try {
    const workshops = await WorkshopEvent.find().sort({ date: -1 });
    res.json({
      success: true,
      workshops: workshops
    });
  } catch (err) {
    console.error("Error fetching workshops:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// POST - Create a new workshop event
router.post("/", adminAuth, async (req, res) => {
  try {
    console.log("📤 Incoming Workshop Data:", req.body); // Log to see what hit the server
    
    const { title, category, description, date, time, duration, price, image, capacity } = req.body;

    const newWorkshop = new WorkshopEvent({
      title,
      category,
      description,
      date: new Date(date), 
      time,
      duration,
      price: Number(price), // Ensure it's a number
      image,
      capacity: Number(capacity) || 10,
      bookedSeats: 0
    });

    const savedWorkshop = await newWorkshop.save();
    console.log("✅ Database Save Success:", savedWorkshop._id);
    
    res.status(201).json({
      success: true,
      message: "Workshop created successfully",
      workshop: savedWorkshop
    });
  } catch (err) {
    // If there is a validation error (e.g. Price missing), this logs it specifically
    console.error("❌ DATABASE ERROR:", err.message); 
    res.status(500).json({ 
      success: false, 
      error: "Database error: " + err.message 
    });
  }
});

// GET - Single workshop event by ID
router.get("/:id", async (req, res) => {
  try {
    const workshop = await WorkshopEvent.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ 
        success: false,
        error: "Workshop not found" 
      });
    }
    res.json({
      success: true,
      workshop: workshop
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// DELETE - Remove workshop event
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const workshop = await WorkshopEvent.findByIdAndDelete(req.params.id);
    if (!workshop) {
      return res.status(404).json({ 
        success: false,
        error: "Workshop not found" 
      });
    }
    res.json({
      success: true,
      message: "Workshop deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// PUT - Update workshop event
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { title, category, description, date, time, duration, price, image, capacity } = req.body;

    const workshop = await WorkshopEvent.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        description,
        date: date ? new Date(date) : undefined,
        time,
        duration,
        price: price ? Number(price) : undefined,
        image,
        capacity: capacity ? Number(capacity) : undefined
      },
      { new: true, runValidators: true }
    );

    if (!workshop) {
      return res.status(404).json({ 
        success: false,
        error: "Workshop not found" 
      });
    }

    res.json({
      success: true,
      message: "Workshop updated successfully",
      workshop: workshop
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

module.exports = router;
