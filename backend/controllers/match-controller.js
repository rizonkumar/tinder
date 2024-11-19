const matchService = require("../services/match-service");
const AppError = require("../utils/appError");
const sendResponse = require("../utils/responseHandler.JS");

exports.swipeRight = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.swipeLeft = async (req, res, next) => {};

exports.getMatches = async (req, res, next) => {
  try {
    const matches = await matchService.getUserMatches(req.user._id);

    sendResponse(res, 200, matches, null, "Matches retrieved successfully");
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }
};

exports.getUserProfiles = async (req, res, next) => {
  try {
    const users = await matchService.getUserProfiles(req.user._id);

    if (!users.length) {
      return sendResponse(res, 200, [], null, "No more profiles available");
    }

    sendResponse(res, 200, users, null, "User profiles retrieved successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving profiles",
    });
  }
};
