const User = require("../models/user-model");
const AppError = require("../utils/appError");

class MatchService {
  async getUserMatches(userId) {
    const user = await User.findById(userId)
      .populate("matches", "name image bio age")
      .select("matches");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user.matches;
  }

  async handleSwipeRight(userId, likedUserId) {}

  async handleSwipeLeft(userId, dislikedUserId) {}
}

module.exports = new MatchService();
