const sendResponse = (res, statusCode, data, token, message) => {
  if (token) {
    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }

  res.status(statusCode).json({
    success: true,
    message,
    data: token
      ? {
          user: data,
          token,
        }
      : data,
  });
};

module.exports = sendResponse;
