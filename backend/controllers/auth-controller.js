const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth-service");
const sendResponse = require("../utils/responseHandler");

exports.signUp = asyncHandler(async (req, res) => {
  const { user, token } = await authService.signup(req.body);
  sendResponse(res, 201, user, token, "User created successfully");
});

exports.signIn = asyncHandler(async (req, res) => {
  const { user, token } = await authService.signIn(req.body.email, req.body.password);
  sendResponse(res, 200, user, token, "User signed in successfully");
});

exports.signOut = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  sendResponse(res, 200, null, null, "Logged out successfully");
});

exports.userInformation = asyncHandler(async (req, res) => {
  const user = await authService.getUserInformation(req.user._id);
  sendResponse(res, 200, { user }, null, "User information retrieved successfully");
});
