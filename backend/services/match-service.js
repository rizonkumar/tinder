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

  async handleSwipeRight(userId, likedUserId) {
    if (userId === likedUserId) {
      throw new AppError("You cannot like yourself", 400);
    }

    const currentUser = await User.findById(userId);
    const likedUser = await User.findById(likedUserId);

    if (!likedUser) {
      throw new AppError("Liked user not found", 404);
    }

    // Check if already matched
    if (currentUser.matches.includes(likedUserId)) {
      throw new AppError("Already matched with this user", 400);
    }

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();

      // if the other user has already liked the current user, it's a match
      if (likedUser.likes.includes(userId)) {
        currentUser.matches.push(likedUserId);
        likedUser.matches.push(currentUser.id);
        await Promise.all([currentUser.save(), likedUser.save()]);
        // TODO: Add a notification to the liked user -> socket.io we will do this later
      }
    }

    return {
      user: currentUser,
      isMatch: likedUser.likes.includes(userId),
      matchedUser: likedUser.likes.includes(userId) ? likedUser : null,
      action: "right",
    };
  }

  async handleSwipeLeft(userId, dislikedUserId) {
    if (userId === dislikedUserId) {
      throw new AppError("Cannot dislike yourself", 400);
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      throw new AppError("Current user not found", 404);
    }

    const dislikedUser = await User.findById(dislikedUserId);
    if (!dislikedUser) {
      throw new AppError("Disliked user not found", 404);
    }

    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);

      // Remove from likes/matches if exists
      currentUser.likes = currentUser.likes.filter(
        (id) => id.toString() !== dislikedUserId
      );
      currentUser.matches = currentUser.matches.filter(
        (id) => id.toString() !== dislikedUserId
      );

      await currentUser.save();
    }

    return {
      user: currentUser,
      isMatch: false,
      matchedUser: null,
      action: "left",
    };
  }

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
