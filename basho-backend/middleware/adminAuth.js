const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "replace_me_in_env";

module.exports = async function (req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    console.log("🔐 Auth header received:", auth.substring(0, 20) + "...");
    
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) {
      console.error("❌ No token provided");
      return res.status(401).json({ success: false, message: "Missing token" });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token verified, user ID:", payload.id);
    
    if (!payload || !payload.id) {
      console.error("❌ Invalid token payload");
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      console.error("❌ User not found:", payload.id);
      return res.status(401).json({ success: false, message: "User not found" });
    }

    console.log("👤 User found:", user.email, "isAdmin:", user.isAdmin);
    
    if (!user.isAdmin) {
      console.error("❌ User is not admin");
      return res.status(403).json({ success: false, message: "Forbidden: admin only" });
    }

    // attach user to request
    req.user = user;
    console.log("✅ Auth passed, proceeding to route");
    next();
  } catch (err) {
    console.error("❌ adminAuth error:", err.message);
    return res.status(401).json({ success: false, message: "Unauthorized: " + err.message });
  }
};
