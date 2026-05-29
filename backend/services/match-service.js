const User = require("../models/user-model");
const AppError = require("../utils/appError");
const { getReceiverSocketId, io } = require("../socket/socket");

class MatchService {
  _getProfileMatchFilter(currentUser) {
    return [
      { _id: { $ne: currentUser._id } },
      { _id: { $nin: currentUser.likes } },
      { _id: { $nin: currentUser.dislikes } },
      { _id: { $nin: currentUser.matches } },
      {
        $or: [
          { genderPreference: currentUser.gender },
          { genderPreference: "both" },
        ],
      },
      {
        $or: [
          { gender: currentUser.genderPreference },
          {
            $and: [
              { gender: { $in: ["male", "female"] } },
              { $expr: { $eq: [currentUser.genderPreference, "both"] } },
            ],
          },
        ],
      },
    ];
  }

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

    if (currentUser.matches.includes(likedUserId)) {
      throw new AppError("Already matched with this user", 400);
    }

    let isMatch = false;

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      currentUser.swipeHistory.push({ user: likedUserId, action: "like" });
      if (currentUser.swipeHistory.length > 15) {
        currentUser.swipeHistory.shift();
      }

      if (likedUser.likes.includes(userId)) {
        currentUser.matches.push(likedUserId);
        likedUser.matches.push(currentUser._id);
        await Promise.all([currentUser.save(), likedUser.save()]);
        isMatch = true;

        const currentSocketId = getReceiverSocketId(userId);
        const likedSocketId = getReceiverSocketId(likedUserId);

        if (currentSocketId) {
          io.to(currentSocketId).emit("matchCelebration", {
            currentUser: {
              _id: currentUser._id,
              name: currentUser.name,
              image: currentUser.image,
            },
            matchedUser: {
              _id: likedUser._id,
              name: likedUser.name,
              image: likedUser.image,
            },
          });
        }
        if (likedSocketId) {
          io.to(likedSocketId).emit("matchCelebration", {
            currentUser: {
              _id: likedUser._id,
              name: likedUser.name,
              image: likedUser.image,
            },
            matchedUser: {
              _id: currentUser._id,
              name: currentUser.name,
              image: currentUser.image,
            },
          });
        }
      } else {
        await currentUser.save();
      }
    }

    return {
      user: currentUser,
      isMatch,
      matchedUser: isMatch ? likedUser : null,
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

      currentUser.likes = currentUser.likes.filter(
        (id) => id.toString() !== dislikedUserId,
      );
      currentUser.superLikes = currentUser.superLikes.filter(
        (id) => id.toString() !== dislikedUserId,
      );
      currentUser.matches = currentUser.matches.filter(
        (id) => id.toString() !== dislikedUserId,
      );

      currentUser.swipeHistory.push({ user: dislikedUserId, action: "nope" });
      if (currentUser.swipeHistory.length > 15) {
        currentUser.swipeHistory.shift();
      }

      await currentUser.save();
    }

    return {
      user: currentUser,
      isMatch: false,
      matchedUser: null,
      action: "left",
    };
  }

  async handleSuperLike(userId, targetUserId) {
    if (userId === targetUserId) {
      throw new AppError("Cannot super like yourself", 400);
    }

    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      throw new AppError("Target user not found", 404);
    }

    if (currentUser.matches.includes(targetUserId)) {
      throw new AppError("Already matched with this user", 400);
    }

    let isMatch = false;

    if (!currentUser.likes.includes(targetUserId)) {
      currentUser.likes.push(targetUserId);
    }

    if (!currentUser.superLikes.includes(targetUserId)) {
      currentUser.superLikes.push(targetUserId);
      currentUser.swipeHistory.push({
        user: targetUserId,
        action: "superlike",
      });
      if (currentUser.swipeHistory.length > 15) {
        currentUser.swipeHistory.shift();
      }

      if (targetUser.likes.includes(userId)) {
        currentUser.matches.push(targetUserId);
        targetUser.matches.push(currentUser._id);
        await Promise.all([currentUser.save(), targetUser.save()]);
        isMatch = true;

        const currentSocketId = getReceiverSocketId(userId);
        const targetSocketId = getReceiverSocketId(targetUserId);

        if (currentSocketId) {
          io.to(currentSocketId).emit("matchCelebration", {
            currentUser: {
              _id: currentUser._id,
              name: currentUser.name,
              image: currentUser.image,
            },
            matchedUser: {
              _id: targetUser._id,
              name: targetUser.name,
              image: targetUser.image,
            },
          });
        }
        if (targetSocketId) {
          io.to(targetSocketId).emit("matchCelebration", {
            currentUser: {
              _id: targetUser._id,
              name: targetUser.name,
              image: targetUser.image,
            },
            matchedUser: {
              _id: currentUser._id,
              name: currentUser.name,
              image: currentUser.image,
            },
          });
        }
      } else {
        await currentUser.save();
        const targetSocketId = getReceiverSocketId(targetUserId);
        if (targetSocketId) {
          io.to(targetSocketId).emit("superLikeReceived", {
            sender: {
              _id: currentUser._id,
              name: currentUser.name,
              image: currentUser.image,
            },
          });
        }
      }
    }

    return {
      user: currentUser,
      isMatch,
      matchedUser: isMatch ? targetUser : null,
      action: "superlike",
    };
  }

  async getUserProfiles(userId) {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    const filter = this._getProfileMatchFilter(currentUser);
    const users = await User.find({ $and: filter })
      .select("name age gender bio image interests superLikes")
      .limit(10);

    return users.map((user) => {
      const userObj = user.toObject();
      userObj.isSuperLikedByTarget =
        user.superLikes?.some(
          (id) => id.toString() === currentUser._id.toString(),
        ) || false;
      return userObj;
    });
  }

  async getExploreProfiles(userId, interest) {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    if (!interest) {
      throw new AppError("Interest is required for explore feed", 400);
    }

    const filter = this._getProfileMatchFilter(currentUser);
    filter.push({ interests: { $regex: new RegExp(`^${interest}$`, "i") } });

    const users = await User.find({ $and: filter })
      .select("name age gender bio image interests superLikes")
      .limit(10);

    return users.map((user) => {
      const userObj = user.toObject();
      userObj.isSuperLikedByTarget =
        user.superLikes?.some(
          (id) => id.toString() === currentUser._id.toString(),
        ) || false;
      return userObj;
    });
  }

  async handleRewind(userId) {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    if (!currentUser.swipeHistory || currentUser.swipeHistory.length === 0) {
      throw new AppError("No swipe history to rewind", 400);
    }

    const lastSwipe = currentUser.swipeHistory.pop();
    const targetUserId = lastSwipe.user;
    const action = lastSwipe.action;

    const targetUser = await User.findById(targetUserId).select(
      "name age gender bio image interests superLikes",
    );
    if (!targetUser) {
      throw new AppError("Target user not found", 404);
    }

    if (action === "like" || action === "superlike") {
      currentUser.likes = currentUser.likes.filter(
        (id) => id.toString() !== targetUserId.toString(),
      );
      currentUser.superLikes = currentUser.superLikes.filter(
        (id) => id.toString() !== targetUserId.toString(),
      );
      currentUser.matches = currentUser.matches.filter(
        (id) => id.toString() !== targetUserId.toString(),
      );
      targetUser.matches = targetUser.matches.filter(
        (id) => id.toString() !== userId.toString(),
      );

      await Promise.all([currentUser.save(), targetUser.save()]);
    } else if (action === "nope") {
      currentUser.dislikes = currentUser.dislikes.filter(
        (id) => id.toString() !== targetUserId.toString(),
      );

      await currentUser.save();
    }

    const userObj = targetUser.toObject();
    userObj.isSuperLikedByTarget =
      targetUser.superLikes?.some(
        (id) => id.toString() === currentUser._id.toString(),
      ) || false;

    return userObj;
  }

  async getUserLikes(userId) {
    const user = await User.findById(userId)
      .populate("likes", "name image bio age interests")
      .select("likes matches");
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const matchesSet = new Set(user.matches.map((m) => m.toString()));
    return user.likes.filter(
      (likedUser) => !matchesSet.has(likedUser._id.toString())
    );
  }
}

module.exports = new MatchService();
