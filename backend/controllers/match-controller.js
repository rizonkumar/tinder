import asyncHandler from "../utils/asyncHandler.js";
import matchService from "../services/match-service.js";
import sendResponse from "../utils/responseHandler.js";

export const swipeRight = asyncHandler(async (req, res) => {
  const { likedUserId } = req.params;
  const result = await matchService.handleSwipeRight(req.user._id, likedUserId);
  const message = result.isMatch ? "It's a match!" : "Swipe right successful";
  sendResponse(res, 200, result, message);
});

export const swipeLeft = asyncHandler(async (req, res) => {
  const { dislikedUserId } = req.params;
  const match = await matchService.handleSwipeLeft(req.user._id, dislikedUserId);
  sendResponse(res, 200, match, "Swipe left successfully");
});

export const superLike = asyncHandler(async (req, res) => {
  const { likedUserId } = req.params;
  const result = await matchService.handleSuperLike(req.user._id, likedUserId);
  const message = result.isMatch ? "It's a match!" : "Super like successful";
  sendResponse(res, 200, result, message);
});

export const getMatches = asyncHandler(async (req, res) => {
  const matches = await matchService.getUserMatches(req.user._id);
  sendResponse(res, 200, matches, "Matches retrieved successfully");
});

export const getUserProfiles = asyncHandler(async (req, res) => {
  const users = await matchService.getUserProfiles(req.user._id);
  if (!users.length) {
    return sendResponse(res, 200, [], "No more profiles available");
  }
  sendResponse(res, 200, users, "User profiles retrieved successfully");
});

export const getExploreProfiles = asyncHandler(async (req, res) => {
  const { interest } = req.query;
  const users = await matchService.getExploreProfiles(req.user._id, interest);
  sendResponse(res, 200, users, "Explore profiles retrieved successfully");
});

export const rewind = asyncHandler(async (req, res) => {
  const targetUser = await matchService.handleRewind(req.user._id);
  sendResponse(res, 200, targetUser, "Swipe rewound successfully");
});

export const getLikedUsers = asyncHandler(async (req, res) => {
  const likedUsers = await matchService.getUserLikes(req.user._id);
  sendResponse(res, 200, likedUsers, "Liked users retrieved successfully");
});

export const getWhoLikedMe = asyncHandler(async (req, res) => {
  const users = await matchService.getWhoLikedMe(req.user._id);
  sendResponse(res, 200, users, "Users who liked you retrieved successfully");
});
