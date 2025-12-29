const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// TEMP in-memory users (Mongo later)
const users = new Map();

app.post("/auth/identify-user", (req, res) => {
  const { contact } = req.body;

  if (!contact) {
    return res.status(400).json({ message: "Contact required" });
  }

  if (users.has(contact)) {
    return res.json({
      status: "existing_user",
      message: "User found. Proceed to verification.",
    });
  }

  users.set(contact, {
    contact,
    createdAt: new Date(),
    verified: false,
  });

  return res.json({
    status: "new_user",
    message: "New user created. Proceed to verification.",
  });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
