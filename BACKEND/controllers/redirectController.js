const Link = require("../models/Link");
const Analytics = require("../models/Analytics");
const useragent = require("express-useragent");

exports.handleRedirect = async (req, res) => {
  try {
    const { slug } = req.params;

    const link = await Link.findOne({ slug });
    if (!link) return res.status(404).send("Link not found");

    // 🔥 EXPIRY LOGIC
    if (link.checkExpired()) {
      link.isExpired = true;
      await link.save();
      return res.redirect("/expired");
    }

    // ---------- analytics + click tracking ----------
    link.clicks++;
    link.lastClickedAt = new Date();

    const today = new Date().toISOString().slice(0, 10);
    let analytics = await Analytics.findOne({ linkId: link._id, date: today });

    if (!analytics) {
      analytics = await Analytics.create({
        linkId: link._id,
        date: today,
        clicks: 0,
        referrers: [],
        devices: [],
        browsers: [],
      });
    }

    analytics.clicks++;

    const ref = req.get("Referer") || "Direct";
    const refEntry = analytics.referrers.find((r) => r.name === ref);
    refEntry
      ? refEntry.count++
      : analytics.referrers.push({ name: ref, count: 1 });

    const deviceType = req.useragent.isMobile
      ? "mobile"
      : req.useragent.isTablet
      ? "tablet"
      : "desktop";

    const dEntry = analytics.devices.find((d) => d.device === deviceType);
    dEntry
      ? dEntry.count++
      : analytics.devices.push({ device: deviceType, count: 1 });

    const browser = req.useragent.browser || "Unknown";
    const bEntry = analytics.browsers.find((b) => b.browser === browser);
    bEntry ? bEntry.count++ : analytics.browsers.push({ browser, count: 1 });

    await analytics.save();
    await link.save();

    // Check for Ad Settings
    const Settings = require("../models/Settings");
    const settings = await Settings.findOne();
    const frontendUrl = process.env.CLIENT_ORIGIN || "http://localhost:5173";

    if (settings && settings.adPagesCount > 0) {
      return res.redirect(`${frontendUrl}/ad/${slug}?p=1`);
    }

    return res.redirect(link.originalUrl);
  } catch (err) {
    console.error("Redirect analytics error:", err);
    res.status(500).send("Server error");
  }
};
