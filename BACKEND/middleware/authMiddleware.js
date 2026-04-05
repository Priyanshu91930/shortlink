const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "accessToken";

const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ errors: ["Not authenticated"] });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ errors: ["Invalid or expired token"] });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ errors: ["Access denied: Admin only"] });
    }
    next();
  } catch (err) {
    console.error("IsAdmin middleware error:", err);
    res.status(500).json({ errors: ["Server error"] });
  }
};

module.exports = { authMiddleware, isAdmin };
