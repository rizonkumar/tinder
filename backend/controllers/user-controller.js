const userService = require("../services/user-service");
const AppError = require("../utils/appError");
const sendResponse = require("../utils/responseHandler.JS");

exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateProfile(req.user._id, req.body);
    sendResponse(res, 200, updatedUser, null, "Profile updated successfully");
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong while updating profile",
    });
  }
};

exports.toggleIncognito = async (req, res, next) => {
  try {
    const updatedUser = await userService.toggleIncognito(req.user._id);
    sendResponse(res, 200, updatedUser, null, "Incognito mode toggled successfully");
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to toggle incognito mode",
    });
  }
};

exports.toggleGold = async (req, res, next) => {
  try {
    const updatedUser = await userService.toggleGold(req.user._id);
    sendResponse(res, 200, updatedUser, null, "Gold membership toggled successfully");
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to toggle gold membership",
    });
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const stats = await userService.getStats(req.user._id);
    sendResponse(res, 200, stats, null, "User statistics retrieved successfully");
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve user statistics",
    });
  }
};
