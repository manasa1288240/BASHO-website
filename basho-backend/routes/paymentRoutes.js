const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  console.log("🔥 /create-order route HIT");

  try {
    const { amount } = req.body;

    console.log("➡️ Amount received:", amount);
    console.log("➡️ Key ID:", process.env.RAZORPAY_KEY_ID);
    console.log(
      "➡️ Key Secret length:",
      process.env.RAZORPAY_KEY_SECRET?.length
    );

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json(order);
  } catch (error) {
    console.error("❌ Razorpay FULL error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      razorpay: error.error || null,
    });
  }
});

module.exports = router;