const express = require("express");
const Workshop = require("../models/workshop");
const sendEmail = require("../utils/sendEmail");
const razorpay = require("../Razorpay");
const crypto = require("crypto"); // Moved to top for consistency

const router = express.Router();

/* -------------------- RAZORPAY PAYMENT ROUTES -------------------- */

router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `workshop-${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const booking = new Workshop({
      ...bookingData,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: "completed"
    });
    await booking.save();

    await sendEmail({
      to: booking.email,
      subject: "Workshop Booking Confirmed – BASHO",
      text: `Hi ${booking.name},\n\nThank you for booking the ${booking.workshopType} workshop!\n\nPreferred Date: ${booking.preferredDate}\nPayment ID: ${razorpay_payment_id}\n\nWe look forward to seeing you soon!\n\n– Team BASHO`,
    });

    res.json({ success: true, message: "Booking confirmed!", booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* -------------------- NEW: EVENT & COLLAB ROUTES -------------------- */

// 1. Handle Event Booking Submission (Matching Modal.jsx)
router.post("/submit-event", async (req, res) => {
  try {
    const { userName, userEmail, eventTitle, eventDate, location, eventType } = req.body;

    // Save to DB (Optional: ensure you have a schema for this or use Workshop)
    // const newEvent = await Workshop.create({ name: userName, email: userEmail, ... });

    await sendEmail({
      to: userEmail,
      subject: "Event Submission Received – BASHO",
      text: `Hi ${userName},\n\nWe have received your request for the event: "${eventTitle}".\n\nDetails:\nDate: ${eventDate}\nLocation: ${location}\nType: ${eventType}\n\nOur team will review this and contact you shortly!\n\n– Team BASHO`
    });

    res.status(200).json({ success: true, message: "Event submission success email sent" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Handle Collaboration Request (Matching Modal.jsx)
router.post("/host-event", async (req, res) => {
  try {
    const { name, email, brand, details, phone } = req.body;

    await sendEmail({
      to: email,
      subject: "Collaboration Request Received – BASHO",
      text: `Hi ${name},\n\nThank you for reaching out from ${brand}!\n\nWe've received your message: "${details}"\n\nOur team will get back to you at ${phone} or via this email soon.\n\n– Team BASHO`
    });

    res.status(200).json({ success: true, message: "Collaboration success email sent" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* -------------------- EXISTING WORKSHOP ROUTES -------------------- */

router.post("/", async (req, res) => {
  try {
    const booking = new Workshop(req.body);
    await booking.save();
    await sendEmail({
      to: booking.email,
      subject: "Workshop Booking Confirmation – BASHO",
      text: `Hi ${booking.name},\n\nThank you for registering for the ${booking.workshopType} workshop.\n\nPreferred Date: ${booking.preferredDate}\n\nWe will contact you shortly.\n\n– Team BASHO`,
    });
    res.status(201).json({ success: true, message: "Workshop booking saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const bookings = await Workshop.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;