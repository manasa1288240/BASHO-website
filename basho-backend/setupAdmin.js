const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");

async function setupAdmin() {
  try {
    console.log("🔧 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const adminEmail = "admin@123.com";
    const adminPassword = "admin123";

    // Check if admin already exists
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log("✏️  Admin exists. Updating...");
    } else {
      console.log("✨ Creating new admin user...");
      admin = new User({ email: adminEmail });
    }

    // Hash and set password
    admin.password = await bcrypt.hash(adminPassword, 10);
    admin.isAdmin = true;
    admin.firstName = "Shivangi";
    admin.lastName = "Admin";
    admin.phone = "+91 9999999999";

    await admin.save();

    console.log("✅ Admin setup complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email: " + adminEmail);
    console.log("🔑 Password: " + adminPassword);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✨ You can now sign in directly with these credentials!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setupAdmin();
