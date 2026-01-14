const express = require("express");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "replace_me_in_env";

const router = express.Router();

/**
 * SIGN IN (email + password)
 * Used for existing users to log in with password
 */
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Issue JWT
    const token = jwt.sign({ id: user._id, isAdmin: !!user.isAdmin }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Sign in successful",
      token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAdmin: !!user.isAdmin
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * UPDATE PROFILE (after sign up)
 * Used to save profile information after OTP verification
 */
router.post("/update-profile", async (req, res) => {
  try {
    const { email, firstName, lastName, phone, password } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile fields
    user.firstName = firstName || "";
    user.lastName = lastName || "";
    user.phone = phone || "";

    // If password is provided, hash it
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Issue JWT
    const token = jwt.sign({ id: user._id, isAdmin: !!user.isAdmin }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Profile updated successfully",
      token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAdmin: !!user.isAdmin
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

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

    // Issue JWT (include isAdmin flag)
    const token = jwt.sign({ id: user._id, isAdmin: !!user.isAdmin }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { email: user.email, isAdmin: !!user.isAdmin },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ADMIN LOGIN (email + password) - only for admin user
 * This route allows the single admin to log in using a password.
 */
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isAdmin) return res.status(403).json({ message: "Forbidden: not an admin" });

    const token = jwt.sign({ id: user._id, isAdmin: true }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Admin login successful", token, user: { email: user.email, isAdmin: true } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DEV: check if a user with given email exists and whether isAdmin flag is set
router.get("/admin-exists", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "email query required" });
    const user = await User.findOne({ email });
    if (!user) return res.json({ exists: false });
    return res.json({ exists: true, email: user.email, isAdmin: !!user.isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DEV: verify a password against stored hash for given email (useful for local debugging)
router.post("/check-password", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password required" });
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(404).json({ message: "user or password not found" });
    const match = await bcrypt.compare(password, user.password);
    return res.json({ match });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
