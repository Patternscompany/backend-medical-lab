require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running on Vercel 🚀");
});

mongoose.connect(process.env.MONGO_URI);

app.use("/api/auth", require("../routes/auth"));
app.use("/api/registration", require("../routes/registration"));

// Serve frontend build (if present) and fallback to index.html for SPA routes
const frontendDist = path.join(__dirname, "..", "..", "frontend-m", "dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.get('*', (req, res, next) => {
    // Let API routes pass through
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(process.env.PORT || 5000, () => console.log(`Backend running on port ${process.env.PORT || 5000}`));
