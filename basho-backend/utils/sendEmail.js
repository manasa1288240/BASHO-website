const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    // ✅ add these timeouts here
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });

  return transporter.sendMail({
    from: `"BASHO" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
