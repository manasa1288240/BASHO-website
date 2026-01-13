const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail"); // Your email utility

// POST - Submit a new event/workshop proposal
router.post("/submit-event", async (req, res) => {
  try {
    const { 
      userName, 
      userEmail, 
      eventTitle, 
      eventDate, 
      description,
      location 
    } = req.body;

    // 1. SAVE TO DATABASE (Example logic)
    // const newEvent = await Event.create({ userName, userEmail, eventTitle... });

    // 2. SUCCESS EMAIL TO THE SUBMITTER
    const userHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #d9534f;">Hi ${userName}!</h2>
        <p>Thank you for submitting your event <strong>"${eventTitle}"</strong> to BASHO.</p>
        <p>Our team is currently reviewing your submission for <strong>${eventDate}</strong>. We will get back to you within 48 hours.</p>
        <br>
        <p>Stay Creative,<br>Team BASHO</p>
      </div>
    `;

    await sendEmail({
      to: userEmail,
      subject: `Event Received: ${eventTitle}`,
      html: userHtml, // Using HTML for a better look
      text: `Hi ${userName}, we received your event submission for ${eventTitle}.`
    });

    // 3. NOTIFICATION EMAIL TO YOU (ADMIN)
    await sendEmail({
      to: "your-admin-email@gmail.com", // YOUR EMAIL HERE
      subject: `🚨 NEW EVENT SUBMISSION: ${eventTitle}`,
      html: `
        <h3>New Event Proposal</h3>
        <p><strong>Host:</strong> ${userName} (${userEmail})</p>
        <p><strong>Title:</strong> ${eventTitle}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Description:</strong> ${description}</p>
      `
    });

    res.status(201).json({ 
      success: true, 
      message: "Event submitted successfully. Check your email!" 
    });

  } catch (error) {
    console.error("Event Submission Error:", error);
    res.status(500).json({ success: false, error: "Failed to submit event" });
  }
});

module.exports = router;