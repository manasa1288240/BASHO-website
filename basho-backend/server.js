const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const workshopRoutes = require("./routes/workshopRoutes");
const productRoutes = require("./routes/productRoutes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// CONNECT DATABASE
connectDB();

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// middlewares
app.use(cors());
app.use(express.json());

app.use("/api/workshops", workshopRoutes);
// server.js

app.use("/api/products", productRoutes);


// test route
app.get("/", (req, res) => {
  res.send("BASHO backend is running");
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
