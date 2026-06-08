// ============================================================
//  SupportBot — Backend Server
//  File: backend/server.js
// ============================================================
require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const morgan     = require("morgan");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");

const chatRouter = require("./routes/chat");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://supportbot-frontend.onrender.com"
  ]
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests — please try again later." }
});
app.use("/api", limiter);

// ── Routes ──────────────────────────────────────────────────
app.use("/api/chat", chatRouter);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    business: process.env.BUSINESS_NAME || "SupportBot",
    timestamp: new Date().toISOString()
  });
});

// ── Error Handler ───────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🤖 SupportBot running on http://localhost:${PORT}`);
  console.log(`📦 Business: ${process.env.BUSINESS_NAME || "Not set — add BUSINESS_NAME to .env"}`);
});

module.exports = app;
