const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailPromise = transporter.sendMail({
    from: `"BASHO" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  // timeout safety
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Email timeout")), 15000)
  );

  return Promise.race([mailPromise, timeoutPromise]);
};

module.exports = sendEmail;
