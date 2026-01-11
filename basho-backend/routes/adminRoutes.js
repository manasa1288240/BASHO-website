const express = require("express");
const router = express.Router();
const Workshop = require("../models/workshop"); 

// GET all workshop registrations
router.get("/workshops", async (req, res) => {
  try {
    const registrations = await Workshop.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Create a new manual registration (Admin adding a person)
router.post("/workshops", async (req, res) => {
  try {
    const newEntry = new Workshop({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      workshopType: req.body.workshopType,
      preferredDate: req.body.preferredDate,
      participants: req.body.participants,
      message: req.body.message,
      paymentStatus: "completed" // Usually manual admin entries are pre-paid
    });
    
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;