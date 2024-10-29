require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mediaRoutes = require("./routes");

const app = express();

// Allow multiple origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL, "https://e-learn-platform-a2yv.vercel.app/", "http://localhost:5173", "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/media", mediaRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

module.exports = app;
