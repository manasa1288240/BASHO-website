const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");
const Workshop = require("../models/workshop");

// GET all customers (directory)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const orders = await Order.find().sort({ createdAt: -1 });
    const workshopBookings = await Workshop.find().sort({ createdAt: -1 });

    const customers = users.map((u) => {
      const userOrders = orders.filter(
        (o) =>
          String(o.userId) === String(u._id) ||
          (o.email && o.email === u.email)
      );

      const userBookings = workshopBookings.filter(
        (b) => b.email === u.email
      );

      const totalSpent = userOrders.reduce(
        (sum, o) => sum + Number(o.totalAmount || o.total || 0),
        0
      );

      return {
        _id: u._id,
        name: u.name || "User",
        email: u.email,
        phone: u.phone || "",
        joinedAt: u.createdAt || null,
        totalOrders: userOrders.length,
        totalSpent,
        totalWorkshops: userBookings.length,
        type:
          userOrders.length > 0
            ? "Buyer"
            : userBookings.length > 0
            ? "Workshop Student"
            : "Registered User",
      };
    });

    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single customer detail
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    const orders = await Order.find({
      $or: [{ userId: user._id }, { email: user.email }],
    }).sort({ createdAt: -1 });

    const workshopBookings = await Workshop.find({
      email: user.email,
    }).sort({ createdAt: -1 });

    const totalSpent = orders.reduce(
      (sum, o) => sum + Number(o.totalAmount || o.total || 0),
      0
    );

    res.json({
      success: true,
      customer: {
        _id: user._id,
        name: user.name || "User",
        email: user.email,
        phone: user.phone || "",
        joinedAt: user.createdAt || null,
        totalOrders: orders.length,
        totalSpent,
        totalWorkshops: workshopBookings.length,
        orders,
        workshopBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
