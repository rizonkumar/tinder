const AppError = require("../utils/appError");

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message, stack: err.stack };

  if (err instanceof AppError) {
    error.statusCode = err.statusCode;
    error.message = err.message;
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.statusCode = 400;
    error.message = messages.join(", ");
  }

  if (err.name === "CastError") {
    error.statusCode = 400;
    error.message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    error.statusCode = 409;
    error.message = `Duplicate value for: ${field}`;
  }

  if (err.name === "JsonWebTokenError") {
    error.statusCode = 401;
    error.message = "Invalid token. Please log in again";
  }

  if (err.name === "TokenExpiredError") {
    error.statusCode = 401;
    error.message = "Your token has expired. Please log in again";
  }

  error.statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: err,
      stack: error.stack,
    });
  }

  if (error.statusCode === 500) {
    console.error("ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

module.exports = errorHandler;
