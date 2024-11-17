import authService from "../services/auth-service";

const { catchAsync } = require("../utils/catchAsync");

exports.signUp = catchAsync(async (req, res) => {
  const { user, token } = await authService.signup(req.body);

  // Set Cookie
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      user,
    },
  });
});

export const signIn = (req, res) => {
  res.send("signIn");
};

export const signOut = (req, res) => {
  res.send("signOut");
};
