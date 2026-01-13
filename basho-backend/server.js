const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// ROUTES
const workshopRoutes = require("./routes/workshopRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");

const app = express();

// ========== CRITICAL MIDDLEWARE ==========
// Parse JSON bodies (THIS IS WHAT YOU'RE MISSING)
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------- DEBUG MIDDLEWARE -------------------- */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  // Log request body for POST/PUT requests
  if (req.method === "POST" || req.method === "PUT") {
    console.log("Request Body:", req.body);
  }
  next();
});

/* -------------------- TEST ENV VARIABLES -------------------- */
app.get("/api/test-env", (req, res) => {
  res.json({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ? "✅ Present" : "❌ Missing",
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? "✅ Present" : "❌ Missing",
    nodeEnv: process.env.NODE_ENV || "Not set",
    port: process.env.PORT || "5000 (default)"
  });
});

/* -------------------- TEST ROUTE -------------------- */
app.get("/", (req, res) => {
  res.send("✅ BASHO backend is running");
});

/* -------------------- API ROUTES -------------------- */

// Public APIs
app.use("/api/workshops", workshopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Gallery API
app.use("/api/gallery", galleryRoutes);

// Admin APIs
app.use("/api/admin/products", adminProductRoutes);

/* -------------------- ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

/* -------------------- SERVER START -------------------- */
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log("📋 Available test routes:");
      console.log(`   - http://localhost:${PORT}/ (Basic test)`);
      console.log(`   - http://localhost:${PORT}/api/test-env (Check env variables)`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });