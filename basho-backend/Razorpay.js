const Razorpay = require("razorpay");

let razorpay = null;

try {
  // Check environment variables
  console.log("🔍 Checking Razorpay keys in utils/Razorpay.js:");
  console.log("   Key ID:", process.env.RAZORPAY_KEY_ID ? "✅ Present" : "❌ Missing");
  console.log("   Key Secret:", process.env.RAZORPAY_KEY_SECRET ? "✅ Present" : "❌ Missing");

  // Initialize Razorpay only if keys are available
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay initialized successfully in utils");
  } else {
    console.warn("⚠️  Razorpay keys not configured. Payment features will be disabled.");
  }
} catch (error) {
  console.error("❌ Razorpay initialization failed:", error.message);
}

module.exports = razorpay;