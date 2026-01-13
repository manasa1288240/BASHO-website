const express = require("express");
const razorpay = require("../Razorpay"); 
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail"); 


const router = express.Router();
console.log("Checking Razorpay Secret:", process.env.RAZORPAY_KEY_SECRET ? "LOADED ✅" : "MISSING ❌");
/* -------------------- CREATE ORDER -------------------- */
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    // Safety check: Ensure amount exists and is a number
    if (!amount) {
      console.error("❌ Error: Amount is missing in request body");
      return res.status(400).json({ success: false, error: "Amount is required" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);
    
    res.json({ success: true, orderId: order.id, amount: order.amount });

  } catch (error) {
    // Log the FULL error object to see what is actually happening
    console.error("🔥 Detailed Razorpay Error:", JSON.stringify(error, null, 2));
    res.status(500).json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    });
  }
});

/* -------------------- VERIFY PAYMENT -------------------- */
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    // 1. Verify signature
    // Ensure RAZORPAY_KEY_SECRET exists in your .env
    if(!process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("RAZORPAY_KEY_SECRET is missing in server environment");
    }

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Payment verification failed" });
    }

    // 2. TRIGGER EMAIL:
    // This will send the email for both Products and Workshops if they use this route.
    const userEmail = orderData?.email || req.body.email; 

    if (userEmail) {
      try {
        await sendEmail({
          to: userEmail,
          subject: "Success! Your BASHO Order is Confirmed",
          text: `Hello! Your payment was successful. Payment ID: ${razorpay_payment_id}. Thank you for your purchase!`
        });
        console.log("✅ Success email sent to:", userEmail);
      } catch (emailErr) {
        console.error("❌ Email failed to send:", emailErr.message);
      }
    }

    res.json({ 
      success: true, 
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id
    });

  } catch (error) {
    console.error("🔥 Verification Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;