const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const matchRoutes = require("./routes/matchRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
// TODO: add like routes
// app.use("/api/likes", likeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
