const User = require("../models/user-model");
const authService = require("../services/auth-service");
const AppError = require("../utils/appError");
const sendResponse = require("../utils/responseHandler.JS");

exports.signUp = async (req, res, next) => {
  try {
    const { user, token } = await authService.signup(req.body);
    sendResponse(res, 201, user, token, "User created successfully");
  } catch (error) {
    // If it's our AppError, send it with its status code
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // For unexpected errors, log them and send a generic response
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during signup",
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { user, token } = await authService.sign(
      req.body.email,
      req.body.password
    );
    sendResponse(res, 200, user, token, "User signed in successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }
};

exports.signOut = async (req, res) => {
  console.log("logout");
  try {
    await authService.signOut();

    res.cookie("jwt", "", {
      maxAge: 1,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
};

exports.userInformation = async (req, res) => {
  try {
    const user = await authService.getUserInformation(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching user information",
    });
  }
};
