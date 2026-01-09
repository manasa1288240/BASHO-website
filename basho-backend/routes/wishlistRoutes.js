const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");

const router = express.Router();

async function getOrCreateUserByEmail(email) {
  if (!email) {
    throw new Error("Email is required");
  }

  let user = await User.findOne({ email }).populate("wishlist");

  if (!user) {
    user = new User({ email, wishlist: [], cart: [], orders: [] });
    await user.save();
    user = await User.findOne({ email }).populate("wishlist");
  }

  return user;
}

// GET /api/wishlist?email=...
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await getOrCreateUserByEmail(email);
    return res.json({ wishlist: user.wishlist || [] });
  } catch (err) {
    console.error("[Wishlist] GET / error", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to load wishlist" });
  }
});

// POST /api/wishlist/toggle { email, productId }
router.post("/toggle", async (req, res) => {
  try {
    const { email, productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await getOrCreateUserByEmail(email);

    const exists = (user.wishlist || []).some(
      (id) => id.toString() === productId
    );

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    await user.populate("wishlist");

    return res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("[Wishlist] POST /toggle error", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to update wishlist" });
  }
});

// POST /api/wishlist/move-to-cart { email, productId }
router.post("/move-to-cart", async (req, res) => {
  try {
    const { email, productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await getOrCreateUserByEmail(email);

    // Remove from wishlist
    user.wishlist = (user.wishlist || []).filter(
      (id) => id.toString() !== productId
    );

    // Add to / increment in cart
    const existing = (user.cart || []).find(
      (item) => item.product.toString() === productId
    );
    if (existing) {
      existing.qty += 1;
    } else {
      user.cart.push({ product: productId, qty: 1 });
    }

    await user.save();
    await user.populate("wishlist");
    await user.populate("cart.product");

    return res.json({ wishlist: user.wishlist, cart: user.cart });
  } catch (err) {
    console.error("[Wishlist] POST /move-to-cart error", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to move item to cart" });
  }
});

module.exports = router;
