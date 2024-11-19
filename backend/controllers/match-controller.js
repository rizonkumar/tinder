const matchService = require("../services/match-service");
const AppError = require("../utils/appError");
const sendResponse = require("../utils/responseHandler.JS");

exports.swipeRight = async (req, res, next) => {
  try {
    const { likedUserId } = req.params;
    const match = await matchService.handleSwipeRight(
      req.user._id,
      likedUserId
    );

    const message = result.isMatch ? "It's a match!" : "Swipe right successful";

    sendResponse(res, 200, match, null, "Swipe right successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while processing swipe",
    });
  }
};

exports.swipeLeft = async (req, res, next) => {
  try {
    const { dislikedUserId } = req.params;
    const match = await matchService.handleSwipeLeft(
      req.user._id,
      dislikedUserId
    );

    sendResponse(res, 200, match, null, "Swipe left successfully");
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing swipe",
    });
  }
};

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
