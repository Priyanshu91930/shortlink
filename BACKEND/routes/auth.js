const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { authMiddleware: auth } = require("../middleware/authMiddleware");

// auth routes
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

// OAuth routes
router.post("/github/callback", controller.githubCallback);
router.post("/google/callback", controller.googleCallback);

// protected
router.get("/me", auth, controller.me);

module.exports = router;
