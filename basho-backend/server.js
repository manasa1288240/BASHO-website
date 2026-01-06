const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

require("dotenv").config();
const connectDB = require("./config/db");
const workshopRoutes = require("./routes/workshopRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");


dotenv.config();

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("BASHO backend is running");
});

// API routes
app.use("/api/workshops", workshopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes); // ✅ YOU WERE MISSING THIS
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Connect DB then start server
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
