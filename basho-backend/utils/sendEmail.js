const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "your-app-password"
    }
  });

  await transporter.sendMail({
    from: `"BASHO Workshops" <yourgmail@gmail.com>`,
    to,
    subject,
    text
  });
};

module.exports = sendEmail;
