const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = "accessToken";

/**
 * Generate JWT token for user
 */
function signToken(user) {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Calculate cookie max age from JWT_EXPIRES_IN
 */
function getCookieMaxAge() {
  if (JWT_EXPIRES_IN.endsWith("d")) {
    const days = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
    return days * 24 * 60 * 60 * 1000;
  }
  return 7 * 24 * 60 * 60 * 1000;
}

/**
 * Get cookie options for JWT
 */
function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true" || isProd,
    sameSite: process.env.COOKIE_SAMESITE || (isProd ? "none" : "lax"),
    maxAge: getCookieMaxAge(),
  };
}

/**
 * Set authentication cookie in response
 */
function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, getCookieOptions());
}

/**
 * Clear authentication cookie
 */
function clearAuthCookie(res) {
  const options = getCookieOptions();
  delete options.maxAge; // No need for maxAge on clearing
  res.clearCookie(COOKIE_NAME, options);
}

/**
 * Format user data for response (remove sensitive fields)
 */
function formatUserResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

module.exports = {
  COOKIE_NAME,
  signToken,
  getCookieOptions,
  setAuthCookie,
  clearAuthCookie,
  formatUserResponse,
};
