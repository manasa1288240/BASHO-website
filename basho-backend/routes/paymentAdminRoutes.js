const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { verifyToken } = require('../middleware/authMiddleware');

// Get all payments (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment statistics
router.get('/stats/overview', verifyToken, async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'successful' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const paymentsByMethod = await Payment.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      paymentsByMethod
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single payment
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
