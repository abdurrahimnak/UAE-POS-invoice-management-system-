const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

async function start() {
  const port = process.env.PORT || 5000;
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI not set");
    process.exit(1);
  }
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
  app.listen(port, () => console.log(`Server listening on ${port}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

module.exports = app;

