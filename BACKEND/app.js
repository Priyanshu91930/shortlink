require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Trust Vercel/Proxy for rate limiting
app.set("trust proxy", 1);

// connect DB
connectDB(process.env.MONGO_URI);

// middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// CORS - allow frontend to send cookies: credentials required
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = process.env.CLIENT_ORIGIN || "http://localhost:5173";
      // Allow if origin matches CLIENT_ORIGIN (exactly) or is localhost in development
      if (!origin || origin === allowed || (process.env.NODE_ENV !== "production" && origin.includes("localhost"))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// simple rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { errors: ["Too many requests, try later"] },
});

// routes
app.use("/api/auth", authLimiter, require("./routes/auth"));
app.use("/api/links", require("./routes/links"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/settings", require("./routes/settings"));

app.get("/expired", (req, res) => {
  res.status(410).send("This link has expired.");
});

// Dynamic Root File Serving (e.g. for ad verification)
const Settings = require("./models/Settings");
app.get("/:filename", async (req, res, next) => {
  try {
    const { filename } = req.params;
    // skip if it's the slug route (handled later or by specific patterns)
    // but settings check is priority if filename matches exactly
    const settings = await Settings.findOne();
    if (settings && settings.rootFileName && settings.rootFileName === filename) {
      return res.send(settings.rootFileContent);
    }
    next();
  } catch (err) {
    next();
  }
});

app.use("/", require("./routes/redirectNew"));

// health
app.get("/health", (req, res) => res.json({ ok: true }));

// error handler (simple)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ errors: ["Server error"] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
