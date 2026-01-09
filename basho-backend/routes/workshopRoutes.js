const express = require("express");
const Workshop = require("../models/workshop");
const sendEmail = require("../utils/sendEmail");
const razorpay = require("../Razorpay");

const router = express.Router();

// POST - create payment order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `workshop-${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - verify payment and save booking
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = req.body;

    // Verify signature
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Save booking
    const booking = new Workshop({
      ...bookingData,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: "completed"
    });
    await booking.save();

    // Send confirmation email
    try {
      await sendEmail({
        to: booking.email,
        subject: "Workshop Booking Confirmed – BASHO",
        text: `
Hi ${booking.name},

Thank you for booking the ${booking.workshopType} workshop!

Preferred Date: ${booking.preferredDate}
Payment ID: ${razorpay_payment_id}

We look forward to seeing you soon!

– Team BASHO
        `,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email", emailError);
    }

    res.json({ success: true, message: "Booking confirmed!", booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - save workshop booking (fallback if no payment)
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
