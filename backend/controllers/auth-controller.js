import asyncHandler from "../utils/asyncHandler.js";
import authService from "../services/auth-service.js";
import sendResponse from "../utils/responseHandler.js";
import config from "../config/env.js";

const setAuthCookie = (res, token) => {
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: config.env === "production",
  });
};

export const signUp = asyncHandler(async (req, res) => {
  const authDto = await authService.signup(req.body);
  setAuthCookie(res, authDto.token);
  sendResponse(res, 201, authDto, "User created successfully");
});

export const signIn = asyncHandler(async (req, res) => {
  const authDto = await authService.signIn(req.body.email, req.body.password);
  setAuthCookie(res, authDto.token);
  sendResponse(res, 200, authDto, "User signed in successfully");
});

export const signOut = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
    httpOnly: true,
    sameSite: "strict",
    secure: config.env === "production",
  });
  sendResponse(res, 200, null, "Logged out successfully");
});

export const userInformation = asyncHandler(async (req, res) => {
  const user = await authService.getUserInformation(req.user._id);
  sendResponse(res, 200, { user }, "User information retrieved successfully");
});
