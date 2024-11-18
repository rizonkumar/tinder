const userService = require("../services/user-service");
const AppError = require("../utils/appError");
const sendResponse = require("../utils/responseHandler.JS");

exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateProfile(req.user._id, req.body);
    sendResponse(res, 200, updatedUser, null, "Profile updated successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }
};