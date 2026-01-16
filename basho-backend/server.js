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
const adminWorkshopRoutes = require("./routes/adminWorkshopRoutes");

const app = express();

// ========== CRITICAL MIDDLEWARE ==========
// Parse JSON bodies (THIS IS WHAT YOU'RE MISSING)
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins for now
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------- DEBUG MIDDLEWARE -------------------- */
app.use((req, res, next) => {
  console.log(`\n=== ${req.method} ${req.url} ===`);
  
  // Log headers for payment requests
  if (req.url.includes('/payment')) {
    console.log('Headers:', req.headers);
  }
  
  // Log request body for POST/PUT requests
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', req.body);
  }
  
  next();
});

/* -------------------- TEST ENDPOINTS -------------------- */
app.get("/", (req, res) => {
  res.send("✅ BASHO backend is running");
});

app.get("/api/test-env", (req, res) => {
  res.json({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ? "✅ Present" : "❌ Missing",
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? "✅ Present" : "❌ Missing",
    nodeEnv: process.env.NODE_ENV || "Not set",
    port: process.env.PORT || "5000 (default)"
  });
});

app.post("/api/payment/test-simple", (req, res) => {
  console.log("✅ Simple test endpoint called");
  console.log("Body:", req.body);
  
  // Return a fixed test order
  res.json({
    success: true,
    id: "order_test_" + Date.now(),
    entity: "order",
    amount: 10000,
    amount_paid: 0,
    amount_due: 10000,
    currency: "INR",
    receipt: "test_receipt",
    status: "created",
    attempts: 0,
    created_at: Date.now()
  });
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
app.use("/api/admin/workshop-events", adminWorkshopRoutes);

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
      console.log(`   - POST http://localhost:${PORT}/api/payment/test-simple (Test payment)`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });