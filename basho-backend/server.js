const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const workshopRoutes = require("./routes/workshopRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

// Middleware
app.use(cors());
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
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes); // ✅ YOU WERE MISSING THIS

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

const PORT = process.env.PORT || 5000;

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
