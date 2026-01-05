const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gopskko8@gmail.com",      // same gmail you enabled 2-step for
      pass: "yixzhlkduoaggzyl" // ← THIS MUST BE APP PASSWORD
    }
  });

  await transporter.sendMail({
    from: `"BASHO" <YOUR_GMAIL@gmail.com>`,
    to,
    subject,
    text
  });
};

module.exports = sendEmail;

