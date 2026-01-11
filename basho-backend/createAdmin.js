const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");
const connectDB = require("./config/db");

async function run() {
  const email = process.argv[2];
  const password = process.argv[3];
  if (!email || !password) {
    console.log("Usage: node createAdmin.js admin@example.com Password123");
    process.exit(1);
  }

  await connectDB();

  const hashed = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.password = hashed;
    existing.isAdmin = true;
    await existing.save();
    console.log("Updated existing user as admin:", email);
  } else {
    const u = new User({ email, password: hashed, isAdmin: true });
    await u.save();
    console.log("Created new admin user:", email);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
