const axios = require("axios");

const sendEmail = async ({ to, subject, text }) => {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "BASHO",
          email: process.env.EMAIL_FROM,
        },
        to: [{ email: to }],
        subject,
        textContent: text,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("✅ Brevo API email sent:", res.data);
    return res.data;
  } catch (err) {
    console.log(
      "❌ Brevo API email failed:",
      err.response?.data || err.message
    );
    throw err;
  }
};

module.exports = sendEmail;
