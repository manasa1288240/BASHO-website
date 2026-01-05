const express = require("express");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/**
 * SEND OTP (EMAIL ONLY)
 */
router.post("/send-otp", async (req, res) => {
  try {
    console.log("SEND OTP BODY --->", req.body);

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ email });
    if (!user) user = new User({ email });

    user.otp = otp;
    user.otpExpiresAt = otpExpiry;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Your BASHO Login OTP",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * VERIFY OTP
 */
router.post("/verify-otp", async (req, res) => {
  try {
    console.log("VERIFY OTP BODY --->", req.body);

    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({
      message: "Login successful",
      user: { email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
