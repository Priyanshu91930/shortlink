const User = require("../models/User");
const crypto = require("crypto");

/**
 * Generate a new API key for the authenticated user
 */
const generateApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    // Generate a secure random API key
    const newApiKey = crypto.randomBytes(32).toString("hex");
    user.apiKey = newApiKey;
    await user.save();

    res.status(200).json({ apiKey: newApiKey });
  } catch (err) {
    console.error("Generate API key error:", err);
    res.status(500).json({ errors: ["Server error while generating API key"] });
  }
};

/**
 * Get the current user's API key
 */
const getApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("+apiKey");
    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }
    res.status(200).json({ apiKey: user.apiKey || null });
  } catch (err) {
    console.error("Get API key error:", err);
    res.status(500).json({ errors: ["Server error while fetching API key"] });
  }
};

module.exports = {
  generateApiKey,
  getApiKey,
};
