const express = require("express");
const Workshop = require("../models/workshop");
const WorkshopEvent = require("../models/WorkshopEvent");
const sendEmail = require("../utils/sendEmail");
const razorpay = require("../Razorpay");
const crypto = require("crypto"); // Moved to top for consistency

const router = express.Router();

/* -------------------- PUBLIC WORKSHOP ENDPOINTS -------------------- */

// GET all published workshops from database (for frontend)
router.get("/published", async (req, res) => {
  try {
    const workshops = await WorkshopEvent.find().sort({ date: 1 });
    
    // Transform database format to frontend format
    const formattedWorkshops = workshops.map(w => ({
      id: w._id,
      title: w.title,
      category: w.category,
      description: w.description || "Explore the art of pottery with our expert instructors",
      duration: w.duration || "2 hours",
      price: `₹${w.price}`,
      date: w.date ? new Date(w.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "Flexible",
      time: w.time || "4:00 PM",
      endTime: w.time ? calculateEndTime(w.time, w.duration) : "6:00 PM",
      image: w.image || "https://via.placeholder.com/400x300",
      location: w.location || "BASHO Studio, Silent Zone",
      maxParticipants: w.capacity || 10,
      bookedSeats: w.bookedSeats || 0,
      includes: [
        "Personalised experience",
        "Flexible dates",
        "Beginner friendly",
        "Custom pricing"
      ]
    }));
    
    res.json({
      success: true,
      workshops: formattedWorkshops
    });
  } catch (err) {
    console.error("❌ Error fetching published workshops:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch workshops" 
    });
  }
});

// Helper function to calculate end time
function calculateEndTime(startTime, duration) {
  if (!startTime || !duration) return "6:00 PM";
  
  const durationHours = parseInt(duration) || 2;
  const [hours, minutes] = startTime.split(":").map(Number);
  const endHours = (hours + durationHours) % 24;
  const period = endHours >= 12 ? "PM" : "AM";
  const displayHours = endHours > 12 ? endHours - 12 : endHours || 12;
  
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

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