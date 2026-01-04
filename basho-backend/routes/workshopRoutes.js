const express = require("express");
const Workshop = require("../models/Workshop");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// POST - save workshop booking and send confirmation email
router.post("/", async (req, res) => {
  try {
    const booking = new Workshop(req.body);
    await booking.save();

    // Try to send confirmation email, but don't fail booking if email fails
    try {
      await sendEmail({
        to: booking.email,
        subject: "Workshop Booking Confirmation – BASHO",
        text: `
Hi ${booking.name},

Thank you for registering for the ${booking.workshopType} workshop.

Preferred Date: ${booking.preferredDate}

We will contact you shortly with confirmation details.

– Team BASHO
        `,
      });
    } catch (emailError) {
      console.error("Failed to send workshop confirmation email", emailError);
    }

    res.status(201).json({ message: "Workshop booking saved" });
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

module.exports = router;
