const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { verifyToken } = require('../middleware/authMiddleware');

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ featured: -1, createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured gallery items
router.get('/featured', async (req, res) => {
  try {
    const gallery = await Gallery.find({ featured: true }).sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get gallery by category
router.get('/category/:category', async (req, res) => {
  try {
    const gallery = await Gallery.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create gallery item (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const gallery = new Gallery(req.body);
    await gallery.save();
    res.status(201).json(gallery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update gallery item (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!gallery) return res.status(404).json({ error: 'Gallery item not found' });
    res.json(gallery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete gallery item (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Gallery item not found' });
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
