const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

// Check if environment variables are available
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log("🔍 Checking Razorpay keys in paymentRoutes:");
console.log("   Key ID:", keyId ? "✅ Present" : "❌ Missing");
console.log("   Key Secret:", keySecret ? "✅ Present" : "❌ Missing");

let razorpay = null;
if (keyId && keySecret) {
  try {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log("✅ Razorpay instance created in paymentRoutes");
  } catch (error) {
    console.error("❌ Failed to create Razorpay instance:", error.message);
  }
} else {
  console.error("❌ Cannot create Razorpay instance - keys missing");
}

router.post("/create-order", async (req, res) => {
  console.log("🔥 /create-order route HIT");
  console.log("📦 Request Body:", req.body);

  // Check if request body exists
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const { amount } = req.body;

  // Check if Razorpay is available
  if (!razorpay) {
    return res.status(500).json({
      success: false,
      message: "Payment service is not configured. Please contact administrator.",
      details: "RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing",
      envCheck: {
        keyId: keyId ? "Present" : "Missing",
        keySecret: keySecret ? "Present" : "Missing"
      }
    });
  }

  if (!amount) {
    return res.status(400).json({
      success: false,
      message: "Amount is required in request body",
      receivedBody: req.body
    });
  }

  try {
    console.log("➡️ Amount received:", amount);
    console.log("➡️ Using Key ID:", keyId?.substring(0, 10) + "...");

    // Validate amount is a number
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
        receivedAmount: amount
      });
    }

    console.log("💰 Creating order for amount:", amountNum, "INR");

    const order = await razorpay.orders.create({
      amount: amountNum * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    console.log("✅ Order created successfully:", order.id);

    return res.status(200).json({
      success: true,
      ...order
    });
  } catch (error) {
    console.error("❌ Razorpay FULL error:", error);

    // More detailed error handling
    let errorMessage = "Payment processing failed";
    let statusCode = 500;

    if (error.error && error.error.description) {
      errorMessage = error.error.description;
      if (error.error.code === "BAD_REQUEST_ERROR") {
        statusCode = 400;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.error || null,
    });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const crypto = require("crypto");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;