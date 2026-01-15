const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password (16 chars)
      },
    });

    const info = await transporter.sendMail({
      from: `"BASHO" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent:", info.response);
    return info;
  } catch (err) {
    console.log("❌ Email send failed:", err.message);
    throw err;
  }
};

module.exports = sendEmail;
