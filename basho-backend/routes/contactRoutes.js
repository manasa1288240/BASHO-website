const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// POST message (from frontend contact form)
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const saved = await Message.create({ name, email, message });

    res.json({ success: true, message: "Message saved", data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
