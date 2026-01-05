const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const workshopRoutes = require("./routes/workshopRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// connect to database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());


app.use("/api/workshops", workshopRoutes);
// server.js

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);


// test route
app.get("/", (req, res) => {
  res.send("BASHO backend is running");
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

