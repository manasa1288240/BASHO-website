const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const workshopRoutes = require("./routes/workshopRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentAdminRoutes = require("./routes/paymentAdminRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const orderRoutes = require("./routes/orderRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("BASHO backend is running");
});

// ROUTES
app.use("/api/workshops", workshopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payments", paymentAdminRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/events", eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

const PORT = process.env.PORT || 5000;

// Start server (MongoDB optional for admin login testing)
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ MongoDB connected`);
    });
  })
  .catch((err) => {
    console.error("⚠️  MongoDB connection failed:", err.message);
    console.log("📢 Starting server anyway... (Admin login will work without DB)");
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`⚠️  Database connection failed - some features may not work`);
      console.log(`💡 To fix: Go to MongoDB Atlas and add your IP to the whitelist`);
    });
  });
