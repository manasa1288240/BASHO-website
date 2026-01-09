const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");

const router = express.Router();

async function getOrCreateUserByEmail(email) {
  if (!email) {
    throw new Error("Email is required");
  }

  let user = await User.findOne({ email })
    .populate("cart.product")
    .populate("orders.items.product");

  if (!user) {
    user = new User({ email, wishlist: [], cart: [], orders: [] });
    await user.save();
    user = await User.findOne({ email })
      .populate("cart.product")
      .populate("orders.items.product");
  }

  return user;
}

// GET /api/cart?email=...
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await getOrCreateUserByEmail(email);
    return res.json({ cart: user.cart || [], history: user.orders || [] });
  } catch (err) {
    console.error("[Cart] GET / error", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to load cart" });
  }
});

// GET /api/cart/history?email=...
router.get("/history", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await getOrCreateUserByEmail(email);
    return res.json({ history: user.orders || [] });
  } catch (err) {
    console.error("[Cart] GET /history error", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to load purchase history" });
  }
});

// POST /api/cart/add { email, productId }
router.post("/add", async (req, res) => {
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

    const existing = (user.cart || []).find(
      (item) => item.product.toString() === productId
    );

    if (existing) {
      existing.qty += 1;
    } else {
      user.cart.push({ product: productId, qty: 1 });
    }

    await user.save();
    await user.populate("cart.product");

    return res.json({ cart: user.cart });
  } catch (err) {
    console.error("[Cart] POST /add error", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to add to cart" });
  }
});

// POST /api/cart/remove { email, productId }
router.post("/remove", async (req, res) => {
  try {
    const { email, productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const user = await getOrCreateUserByEmail(email);
    user.cart = (user.cart || []).filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    await user.populate("cart.product");

    return res.json({ cart: user.cart });
  } catch (err) {
    console.error("[Cart] POST /remove error", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to remove from cart" });
  }
});

// POST /api/cart/purchase { email, productId }
router.post("/purchase", async (req, res) => {
  try {
    const { email, productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const user = await getOrCreateUserByEmail(email);

    const index = (user.cart || []).findIndex(
      (item) => item.product.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const cartItem = user.cart[index];

    user.orders.push({
      items: [
        {
          product: cartItem.product,
          qty: cartItem.qty,
        },
      ],
      purchasedAt: new Date(),
    });

    user.cart.splice(index, 1);

    await user.save();
    await user.populate("cart.product");
    await user.populate("orders.items.product");

    return res.json({ cart: user.cart, history: user.orders });
  } catch (err) {
    console.error("[Cart] POST /purchase error", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to complete purchase" });
  }
});

module.exports = router;
