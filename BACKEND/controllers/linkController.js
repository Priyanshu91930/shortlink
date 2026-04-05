const Link = require("../models/Link");
const {
  generateSlug,
  validateUrl,
  parseExpiresAt,
  parseMaxClicks,
  checkSlugAvailability,
  refreshExpirationStatus,
} = require("../utils/linkHelpers");

// Create new short link
exports.createLink = async (req, res) => {
  try {
    const { originalUrl, customSlug, expiresAt, maxClicks, domain } = req.body;

    // Validate URL
    const urlValidation = validateUrl(originalUrl);
    if (!urlValidation.valid) {
      return res.status(400).json({ errors: [urlValidation.error] });
    }

    // Generate or use custom slug
    let slug = customSlug?.toLowerCase().trim() || generateSlug();

    // Check slug availability
    const isAvailable = await checkSlugAvailability(Link, slug);
    if (!isAvailable) {
      return res.status(400).json({ errors: ["Slug already taken"] });
    }

    // Validate expiration date
    const expiresValidation = parseExpiresAt(expiresAt);
    if (!expiresValidation.valid) {
      return res.status(400).json({ errors: [expiresValidation.error] });
    }

    // Validate max clicks
    const clicksValidation = parseMaxClicks(maxClicks);
    if (!clicksValidation.valid) {
      return res.status(400).json({ errors: [clicksValidation.error] });
    }

    const newLink = await Link.create({
      user: req.userId,
      originalUrl,
      slug,
      domain: domain || "",
      expiresAt: expiresValidation.value,
      maxClicks: clicksValidation.value,
    });

    res.status(201).json({ link: newLink });
  } catch (err) {
    console.error("Link creation error:", err);
    console.error("Error details:", err.message);
    res.status(500).json({ errors: [err.message || "Server error"] });
  }
};

// Fetch all links for user (with search filter)
exports.getLinks = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = { user: req.userId };

    if (search) {
      const s = new RegExp(search, "i");
      filter.$or = [{ slug: s }, { originalUrl: s }];
    }

    const links = await Link.find(filter).sort({ createdAt: -1 });

    // auto check expiry flag
    links.forEach((l) => {
      if (l.checkExpired()) l.isExpired = true;
    });

    res.json({ links });
  } catch (err) {
    console.error("Get links error:", err);
    res.status(500).json({ errors: ["Server error"] });
  }
};

// Edit link
exports.updateLink = async (req, res) => {
  try {
    const { id } = req.params;

    // Update metadata

    const link = await Link.findOne({ _id: id, user: req.userId });
    if (!link) {
      return res.status(404).json({ errors: ["Link not found"] });
    }

    const { originalUrl, expiresAt, maxClicks } = req.body;

    // Validate URL if provided
    if (originalUrl) {
      const urlValidation = validateUrl(originalUrl);
      if (!urlValidation.valid) {
        return res.status(400).json({ errors: [urlValidation.error] });
      }
      link.originalUrl = originalUrl;
    }

    // Update expiration date
    if (expiresAt !== undefined) {
      if (expiresAt === null || expiresAt === "") {
        link.expiresAt = null;
      } else {
        const expiresValidation = parseExpiresAt(expiresAt);
        if (!expiresValidation.valid) {
          return res.status(400).json({ errors: [expiresValidation.error] });
        }
        link.expiresAt = expiresValidation.value;
      }
    }

    // Update max clicks
    if (maxClicks !== undefined) {
      if (maxClicks === null || maxClicks === "") {
        link.maxClicks = null;
      } else {
        const clicksValidation = parseMaxClicks(maxClicks);
        if (!clicksValidation.valid) {
          return res.status(400).json({ errors: [clicksValidation.error] });
        }
        link.maxClicks = clicksValidation.value;
      }
    }

    // Refresh expiration status
    refreshExpirationStatus(link);

    await link.save();
    res.json({ link });
  } catch (err) {
    console.error("❌ Update link error:", err);
    console.error("Error details:", err.message);
    res.status(500).json({ errors: [err.message || "Server error"] });
  }
};

// Delete link
exports.deleteLink = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findOneAndDelete({ _id: id, user: req.userId });
    if (!link) return res.status(404).json({ errors: ["Link not found"] });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: ["Server error"] });
  }
};

// Single link details (for analytics)
exports.getSingleLink = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findOne({ _id: id, user: req.userId });
    if (!link) return res.status(404).json({ errors: ["Link not found"] });

    res.json({ link });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: ["Server error"] });
  }
};

// GET destination URL by slug (Public)
exports.getLinkBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const link = await Link.findOne({ slug });
    if (!link) return res.status(404).json({ errors: ["Link not found"] });

    res.json({ originalUrl: link.originalUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: ["Server error"] });
  }
};
