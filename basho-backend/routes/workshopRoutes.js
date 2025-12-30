const express = require("express");
const Workshop = require("../models/Workshop");

const router = express.Router();

// POST - save workshop booking
router.post("/", async (req, res) => {
  try {
    const booking = new Workshop(req.body);
    await booking.save();
    res.status(201).json({ message: "Workshop booking saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// GET - all workshop bookings (admin)
router.get("/", async (req, res) => {
  try {
    const bookings = await Workshop.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  try {
    const booking = new Workshop(req.body);
    await booking.save();

    await sendEmail({
      to: booking.email,
      subject: "Workshop Booking Confirmation – BASHO",
      text: `
Hi ${booking.name},

Thank you for registering for the ${booking.workshopType} workshop.

Preferred Date: ${booking.preferredDate}

We will contact you shortly with confirmation details.

– Team BASHO
      `
    });

    res.status(201).json({ message: "Booking saved & confirmation email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - all workshop bookings (admin)
router.get("/", async (req, res) => {
  try {
    const bookings = await Workshop.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
