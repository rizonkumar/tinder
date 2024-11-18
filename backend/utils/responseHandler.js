const sendResponse = (res, statusCode, user, token, message) => {
  // Set cookie
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  // Send response
  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user,
      token,
    },
  });
};

module.exports = sendResponse;
