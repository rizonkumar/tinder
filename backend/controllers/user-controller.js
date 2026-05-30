const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/user-service");
const sendResponse = require("../utils/responseHandler");

exports.updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user._id, req.body);
  sendResponse(res, 200, updatedUser, null, "Profile updated successfully");
});

exports.toggleIncognito = asyncHandler(async (req, res) => {
  const updatedUser = await userService.toggleIncognito(req.user._id);
  sendResponse(res, 200, updatedUser, null, "Incognito mode toggled successfully");
});

exports.toggleGold = asyncHandler(async (req, res) => {
  const updatedUser = await userService.toggleGold(req.user._id);
  sendResponse(res, 200, updatedUser, null, "Gold membership toggled successfully");
});

exports.getStats = asyncHandler(async (req, res) => {
  const stats = await userService.getStats(req.user._id);
  sendResponse(res, 200, stats, null, "User statistics retrieved successfully");
});
