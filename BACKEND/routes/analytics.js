const express = require("express");
const router = express.Router();
const { authMiddleware: auth } = require("../middleware/authMiddleware");
const { getAnalytics } = require("../controllers/analyticsController");

router.get("/:slug", auth, getAnalytics);

module.exports = router;
