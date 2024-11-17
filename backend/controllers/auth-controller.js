import authService from "../services/auth-service";

const { catchAsync } = require("../utils/catchAsync");

exports.signUp = catchAsync(async (req, res) => {
  const user = await authService.signup(req.body);

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
