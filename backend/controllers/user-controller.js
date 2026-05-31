import asyncHandler from "../utils/asyncHandler.js";
import userService from "../services/user-service.js";
import sendResponse from "../utils/responseHandler.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user._id, req.body);
  sendResponse(res, 200, updatedUser, "Profile updated successfully");
});

export const toggleIncognito = asyncHandler(async (req, res) => {
  const updatedUser = await userService.toggleIncognito(req.user._id);
  sendResponse(res, 200, updatedUser, "Incognito mode toggled successfully");
});

export const toggleGold = asyncHandler(async (req, res) => {
  const updatedUser = await userService.toggleGold(req.user._id);
  sendResponse(res, 200, updatedUser, "Gold membership toggled successfully");
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await userService.getStats(req.user._id);
  sendResponse(res, 200, stats, "User statistics retrieved successfully");
});
