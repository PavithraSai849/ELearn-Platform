require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mediaRoutes = require("./routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes configuration
app.use("/media", mediaRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// Export the app as a module for Vercel
module.exports = app;
