const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");
const Workshop = require("../models/workshop");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const orders = await Order.find().sort({ createdAt: -1 });

    const workshopBookings = await Workshop.find().sort({ createdAt: -1 });

    const customers = users.map((u) => {
      const userOrders = orders.filter(
        (o) => String(o.userId) === String(u._id) || o.email === u.email
      );

      const userBookings = workshopBookings.filter(
        (b) => b.email === u.email
      );

      const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return {
        _id: u._id,
        name: u.name || "User",
        email: u.email,
        phone: u.phone || "",
        joinedAt: u.createdAt,
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

module.exports = router;
