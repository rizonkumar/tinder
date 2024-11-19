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

  async getUserProfiles(userId) {
    // 1. First, find the current user
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    // 2. Find potential matches using MongoDB query
    const users = await User.find({
      $and: [
        // All these conditions must be true
        // Condition 1: Don't show the current user to themselves
        { _id: { $ne: currentUser._id } }, // $ne means "not equal"

        // Condition 2: Don't show users they've already liked
        { _id: { $nin: currentUser.likes } }, // $nin means "not in array"

        // Condition 3: Don't show users they've already disliked
        { _id: { $nin: currentUser.dislikes } },

        // Condition 4: Don't show existing matches
        { _id: { $nin: currentUser.matches } },

        // Condition 5: Complex gender preference matching
        {
          $or: [
            // Either of these conditions can be true
            // Option A: Other user specifically prefers current user's gender
            { genderPreference: currentUser.gender },
            // Option B: Other user is open to all genders ("both")
            { genderPreference: "both" },
          ],
        },

        // Condition 6: Current user's preferences match with other users
        {
          $or: [
            // Either of these conditions can be true
            // Option A: Other user's gender matches current user's preference
            { gender: currentUser.genderPreference },
            // Option B: Handle when current user prefers "both"
            {
              $and: [
                // Ensure other user has a valid gender
                { gender: { $in: ["male", "female"] } },
                // Current user's preference is "both"
                { $expr: { $eq: [currentUser.genderPreference, "both"] } },
              ],
            },
          ],
        },
      ],
    })
      .select("name age gender bio image") // Only get these fields
      .limit(10); // Get maximum 20 profiles

    return users;
  }
}

module.exports = new MatchService();
