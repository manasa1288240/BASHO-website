const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail"); // Your existing util

// POST - Handle Collaboration Form Submission
router.post("/host-event", async (req, res) => {
  try {
    const { name, email, eventType, details, date } = req.body;

    // 1. (Optional) Save the data to your MongoDB here
    // const newEvent = await Event.create({ name, email, eventType, details, date });

    // 2. Send Success Email to the USER
    await sendEmail({
      to: email,
      subject: "Collaboration Request Received - BASHO",
      text: `Hi ${name},\n\nThank you for reaching out to collaborate with BASHO! We have received your request to host a ${eventType} on ${date}. Our team will review the details and get back to you shortly.\n\nBest Regards,\nTeam BASHO`
    });

    // 3. Send Notification Email to YOURSELF (Admin)
    // Replace 'your-admin-email@gmail.com' with your actual email
    await sendEmail({
      to: "your-admin-email@gmail.com", 
      subject: `New Collaboration Request: ${eventType}`,
      text: `You have a new request!\n\nName: ${name}\nEmail: ${email}\nEvent: ${eventType}\nDetails: ${details}`
    });

    res.status(200).json({
      success: true,
      message: "Application submitted successfully and confirmation emails sent."
    });

  } catch (error) {
    console.error("Collaboration Form Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Something went wrong while processing your request." 
    });
  }
});

module.exports = router;