const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const workshopRoutes = require("./routes/workshopRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

// ✅ NEW: Gallery routes
const galleryRoutes = require("./routes/galleryRoutes");

const app = express();

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
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/chatbot", chatbotRoutes);

// ✅ NEW: Gallery API
app.use("/api/gallery", galleryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

const PORT = process.env.PORT || 5000;

// DB connect + server start
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });
