const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const Settings = require("../models/Settings");

// GET settings (Public - used by redirect logic)
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    console.error("Fetch settings error:", err);
    res.status(500).json({ errors: ["Server error"] });
  }
});

// UPDATE settings (Admin only)
router.put("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { adPagesCount, adTimer, adScript, rootFileName, rootFileContent } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (adPagesCount !== undefined) settings.adPagesCount = adPagesCount;
    if (adTimer !== undefined) settings.adTimer = adTimer;
    if (adScript !== undefined) settings.adScript = adScript;
    if (rootFileName !== undefined) settings.rootFileName = rootFileName;
    if (rootFileContent !== undefined) settings.rootFileContent = rootFileContent;

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ errors: ["Server error"] });
  }
});

module.exports = router;
