const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware: auth } = require("../middleware/authMiddleware");

// All routes here require authentication (via cookie/JWT)
router.use(auth);

// API Key management
router.get("/api-key", userController.getApiKey);
router.post("/api-key/generate", userController.generateApiKey);

module.exports = router;
