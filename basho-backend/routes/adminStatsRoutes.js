const express = require("express");

const Order = require("../models/Order");
const Workshop = require("../models/workshop");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    const workshops = await Workshop.find();

    let totalRevenue = 0;
    let gstCollected = 0;
    let activeOrders = 0;

    for (let o of orders) {
      const amount = Number(o.totalAmount || o.amount || 0);

      // total revenue only for paid orders
      if (o.paymentStatus === "completed" || o.isPaid === true) {
        totalRevenue += amount;

        // if your order already stores gst use it, else calculate 18%
        const gst = Number(o.gstAmount || (amount * 0.18));
        gstCollected += gst;
      }

      // active orders
      if (
        o.status === "pending" ||
        o.status === "processing" ||
        o.status === "shipped"
      ) {
        activeOrders += 1;
      }
    }

    const workshopBookings = workshops.length;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        activeOrders,
        workshopBookings,
        gstCollected,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
