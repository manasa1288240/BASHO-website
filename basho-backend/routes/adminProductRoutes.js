const express = require("express");
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Protect all admin product routes
router.use(adminAuth);

// Example protected admin route to verify middleware
router.get("/ping", (req, res) => {
  res.json({ success: true, message: "pong", admin: { id: req.user._id, email: req.user.email } });
});

// GET all products (admin)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE product
router.post("/", async (req, res) => {
  try {
    console.log("📝 Creating product with data:", req.body);
    const data = req.body;
    
    // Validate required fields
    if (!data.name || !data.category || !data.price) {
      return res.status(400).json({ success: false, message: "Missing required fields: name, category, price" });
    }
    
    const product = new Product(data);
    await product.save();
    console.log("✅ Product created:", product);
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("❌ Product creation error:", err.message, err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
