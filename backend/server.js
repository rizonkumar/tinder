const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { app, server } = require("./socket/socket.js");
const authRoutes = require("./routes/auth-routes.js");
const userRoutes = require("./routes/user-routes.js");
const matchRoutes = require("./routes/match-routes.js");
const messageRoutes = require("./routes/message-routes.js");
const connectDB = require("./config/db.js");
const AppError = require("./utils/appError.js");
const errorHandler = require("./middleware/errorHandler.js");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);

app.all("*", (req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

(async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
