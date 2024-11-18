const Joi = require("joi");
const User = require("../models/user-model");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().min(18).required(),
  gender: Joi.string().valid("male", "female").required(),
  genderPreference: Joi.string().valid("male", "female", "both").required(),
});

exports.validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

exports.validateSignIn = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      success: false,
      message: "Email and password are required",
    });
  }
  next();
};

exports.protectRoute = async (req, res, next) => {
  try {
    let token;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("Please log in to access this resource", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).select("-password");

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your token has expired. Please log in again",
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
