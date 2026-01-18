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

// ADMIN ROUTES
const adminWorkshopEventRoutes = require("./routes/adminWorkshopEventRoutes");
const adminTestimonialRoutes = require("./routes/adminTestimonialRoutes");
const adminVideoTestimonialRoutes = require("./routes/adminVideoTestimonialRoutes");
const adminStatsRoutes = require("./routes/adminStatsRoutes");
const adminCustomerRoutes = require("./routes/adminCustomerRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

// NEW: CONTACT + REVIEWS ROUTES
const contactRoutes = require("./routes/contactRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// ========== CRITICAL MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------- DEBUG MIDDLEWARE -------------------- */
app.use((req, res, next) => {
  console.log(`\n=== ${req.method} ${req.url} ===`);

  if (req.url.includes("/payment")) {
    console.log("Headers:", req.headers);
  }

  if (req.method === "POST" || req.method === "PUT") {
    console.log("Request Body:", req.body);
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
    port: process.env.PORT || "5000 (default)",
  });
});

app.post("/api/payment/test-simple", (req, res) => {
  console.log("✅ Simple test endpoint called");
  console.log("Body:", req.body);

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
    created_at: Date.now(),
  });
});

/* -------------------- API ROUTES -------------------- */

// Workshop bookings + Razorpay
app.use("/api/workshops", workshopRoutes);

// Products
app.use("/api/products", productRoutes);

// Auth
app.use("/api/auth", authRoutes);

// Payments
app.use("/api/payment", paymentRoutes);

// Wishlist
app.use("/api/wishlist", wishlistRoutes);

// Cart
app.use("/api/cart", cartRoutes);

// Chatbot
app.use("/api/chatbot", chatbotRoutes);

// Gallery
app.use("/api/gallery", galleryRoutes);

// Contact messages
app.use("/api/contact", contactRoutes);

// Reviews
app.use("/api/reviews", reviewRoutes);

// Admin products
app.use("/api/admin/products", adminProductRoutes);

// Admin workshop events
app.use("/api/admin/workshop-events", adminWorkshopEventRoutes);

// Admin written testimonials
app.use("/api/admin/testimonials", adminTestimonialRoutes);

// Admin video testimonials
app.use("/api/admin/video-testimonials", adminVideoTestimonialRoutes);

// Admin stats
app.use("/api/admin/stats", adminStatsRoutes);

// Admin customers
app.use("/api/admin/customers", adminCustomerRoutes);

// Admin orders
app.use("/api/admin/orders", adminOrderRoutes);

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
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
