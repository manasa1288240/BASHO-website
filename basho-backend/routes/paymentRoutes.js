// routes/paymentRoutes.js
const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

// Check environment variables
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log("🔍 Checking Razorpay keys:");
console.log("   Key ID:", keyId ? "✅ Present" : "❌ Missing");
console.log("   Key Secret:", keySecret ? "✅ Present" : "❌ Missing");

let razorpay = null;
if (keyId && keySecret) {
  try {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log("✅ Razorpay instance created");
  } catch (error) {
    console.error("❌ Failed to create Razorpay instance:", error.message);
  }
}

// CREATE ORDER
router.post("/create-order", async (req, res) => {
  console.log("🔥 /create-order called");
  console.log("Request body:", req.body);

  if (!razorpay) {
    return res.status(500).json({
      success: false,
      message: "Payment service not configured",
      error: "RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing"
    });
  }

  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required"
      });
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number"
      });
    }

    console.log(`💰 Creating order for ₹${amountNum}`);

    const order = await razorpay.orders.create({
      amount: amountNum * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    console.log("✅ Order created:", order.id);

    return res.json({
      success: true,
      ...order
    });

  } catch (error) {
    console.error("❌ Razorpay error:", error);

    return res.status(500).json({
      success: false,
      message: error.error?.description || error.message || "Payment failed",
      error: error.error || null
    });
  }
});

// VERIFY PAYMENT
router.post("/verify", async (req, res) => {
  try {
    const crypto = require("crypto");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({
        success: true,
        message: "Payment verified"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }
  } catch (error) {
    console.error("❌ Verification error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;