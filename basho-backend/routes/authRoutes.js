const express = require("express");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "replace_me_in_env";

const router = express.Router();

/**
 * CHECK IF EMAIL IS ADMIN (used for frontend to decide flow)
 */
router.post("/check-admin-email", async (req, res) => {
  try {
    console.log("🔍 CHECK-ADMIN-EMAIL called with:", req.body);

    const { email } = req.body;
    if (!email) {
      console.log("⚠️  No email provided");
      return res.status(400).json({ isAdmin: false, exists: false });
    }

    const user = await User.findOne({ email });
    console.log(`✅ Found user for ${email}:`, {
      exists: !!user,
      isAdmin: user?.isAdmin,
    });

    const isAdmin = user && user.isAdmin ? true : false;

    return res.json({ isAdmin, exists: !!user });
  } catch (err) {
    console.error("❌ Error in check-admin-email:", err.message);
    return res.status(500).json({ error: "Server error", message: err.message });
  }
});

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
    const token = jwt.sign(
      { id: user._id, isAdmin: !!user.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Sign in successful",
      token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAdmin: !!user.isAdmin,
      },
    });
  } catch (err) {
    console.error("❌ SIGNIN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
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
    const token = jwt.sign(
      { id: user._id, isAdmin: !!user.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Profile updated successfully",
      token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAdmin: !!user.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * SEND OTP (EMAIL ONLY)
 * ✅ FIXED: Responds immediately so frontend does NOT stay stuck on "Sending..."
 * Email will be sent in background.
 * For signup: Does NOT create user yet (user is created only after profile submission)
 * For existing users: Just stores OTP
 */
router.post("/send-otp", async (req, res) => {
  try {
    console.log("📩 SEND OTP BODY --->", req.body);

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // For signup flow: only store OTP temporarily, don't create user
    // For signin flow or forgot password: update existing user or create temp OTP record
    let user = await User.findOne({ email });
    
    if (!user) {
      // For signup: just send OTP, don't create user yet
      // Store OTP in a temporary way - we'll use User model but mark it somehow
      // Actually, let's create a minimal user doc that will be replaced on profile submission
      user = new User({ email });
    }

    user.otp = otp;
    user.otpExpiresAt = otpExpiry;
    await user.save();

    // ✅ Respond immediately so frontend can show OTP screen
    res.json({ message: "OTP generated" });

    // ✅ Send email in background (won't block request)
    sendEmail({
      to: email,
      subject: "Your BASHO Login OTP",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    })
      .then(() => console.log("✅ OTP email sent to:", email))
      .catch((err) =>
        console.log("❌ OTP email failed:", err.message || err)
      );
  } catch (error) {
    console.error("❌ SEND OTP ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * VERIFY OTP
 * For signup: Just verifies OTP, doesn't create full account
 * For signin/forgot-password: Verifies OTP and can issue token if password exists
 */
router.post("/verify-otp", async (req, res) => {
  try {
    console.log("✅ VERIFY OTP BODY --->", req.body);

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

    // For signup: just verify OTP, don't issue token yet (token issued after profile submission)
    // For signin/forgot-password: if user has a password, they are an existing user, issue token
    if (user.password) {
      // Existing user (signin or forgot password flow)
      const token = jwt.sign(
        { id: user._id, isAdmin: !!user.isAdmin },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "OTP verified",
        token,
        user: { email: user.email, isAdmin: !!user.isAdmin },
      });
    } else {
      // New user in signup flow - just verify, no token yet
      return res.json({
        message: "OTP verified successfully",
        verified: true,
      });
    }
  } catch (error) {
    console.error("❌ VERIFY OTP ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * ADMIN LOGIN (email + password) - only for admin user
 * This route allows the single admin to log in using a password.
 */
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isAdmin)
      return res.status(403).json({ message: "Forbidden: not an admin" });

    const token = jwt.sign({ id: user._id, isAdmin: true }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Admin login successful",
      token,
      user: { email: user.email, isAdmin: true },
    });
  } catch (err) {
    console.error("❌ ADMIN LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// DEV: check if a user with given email exists and whether isAdmin flag is set
router.get("/admin-exists", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "email query required" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ exists: false });

    return res.json({
      exists: true,
      email: user.email,
      isAdmin: !!user.isAdmin,
    });
  } catch (err) {
    console.error("❌ ADMIN EXISTS ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// DEV: verify a password against stored hash for given email (useful for local debugging)
router.post("/check-password", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(404).json({ message: "user or password not found" });

    const match = await bcrypt.compare(password, user.password);
    return res.json({ match });
  } catch (err) {
    console.error("❌ CHECK PASSWORD ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * RESET PASSWORD (after OTP verification)
 * Used for "Forgot Password" flow
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("❌ RESET PASSWORD ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
