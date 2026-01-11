const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { verifyToken } = require('../middleware/authMiddleware');

// Get all testimonials (public - shows only approved)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'approved' })
      .sort({ featured: -1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all testimonials (admin only - all statuses)
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ status: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured testimonials
router.get('/featured', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ 
      status: 'approved',
      featured: true 
    }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create testimonial
router.post('/', async (req, res) => {
  try {
    const testimonial = new Testimonial({
      ...req.body,
      status: 'pending'
    });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update testimonial (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Approve testimonial (admin only)
router.post('/:id/approve', verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', featured: true },
      { new: true }
    );
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reject testimonial (admin only)
router.post('/:id/reject', verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete testimonial (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
