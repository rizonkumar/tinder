const authService = require("../services/auth-service");
const AppError = require("../utils/appError");

exports.signUp = async (req, res, next) => {
  try {
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
  } catch (error) {
    // If it's our AppError, send it with its status code
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // For unexpected errors, log them and send a generic response
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during signup",
    });
  }
};

// export const signIn = (req, res) => {
//   res.send("signIn");
// };

// export const signOut = (req, res) => {
//   res.send("signOut");
// };
