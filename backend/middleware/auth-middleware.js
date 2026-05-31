import jwt from "jsonwebtoken";
import userRepository from "../repositories/user-repository.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import config from "../config/env.js";

export const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Please log in to access this resource", 401);
  }

  const decoded = jwt.verify(token, config.jwtSecret);

  const currentUser = await userRepository.findById(decoded.id, "-password");

  if (!currentUser) {
    throw new AppError("User no longer exists", 401);
  }

  req.user = currentUser;
  next();
});
