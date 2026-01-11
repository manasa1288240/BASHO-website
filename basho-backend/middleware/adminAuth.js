const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "replace_me_in_env";

module.exports = async function (req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ success: false, message: "Missing token" });

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.id) return res.status(401).json({ success: false, message: "Invalid token" });

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    if (!user.isAdmin) return res.status(403).json({ success: false, message: "Forbidden: admin only" });

    // attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("adminAuth error", err.message);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
