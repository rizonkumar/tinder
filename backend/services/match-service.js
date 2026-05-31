const userRepository = require("../repositories/user-repository");
const AppError = require("../utils/appError");
const { getReceiverSocketId, io } = require("../socket/socket");
const { SOCKET_EVENTS } = require("../constants/socket-events");
const { SWIPE_ACTIONS } = require("../constants/swipe-actions");
const { GENDERS, GENDER_PREFERENCES } = require("../constants/genders");
const UserDto = require("../dtos/user-dto");
const { SwipeResultDto, ProfileDto } = require("../dtos/match-dto");

class MatchService {
  _emitMatchCelebration(userA, userB) {
    const socketA = getReceiverSocketId(userA._id);
    const socketB = getReceiverSocketId(userB._id);
    const payload = (current, matched) => ({
      currentUser: { _id: current._id, name: current.name, image: current.image },
      matchedUser: { _id: matched._id, name: matched.name, image: matched.image },
    });
    if (socketA) {
      io.to(socketA).emit(SOCKET_EVENTS.MATCH_CELEBRATION, payload(userA, userB));
    }
    if (socketB) {
      io.to(socketB).emit(SOCKET_EVENTS.MATCH_CELEBRATION, payload(userB, userA));
    }
  }

  _getProfileMatchFilter(currentUser) {
    return [
      { _id: { $ne: currentUser._id } },
      { _id: { $nin: currentUser.likes } },
      { _id: { $nin: currentUser.dislikes } },
      { _id: { $nin: currentUser.matches } },
      {
        $or: [
          { genderPreference: currentUser.gender },
          { genderPreference: GENDER_PREFERENCES.BOTH },
        ],
      },
      {
        $or: [
          { gender: currentUser.genderPreference },
          {
            $and: [
              { gender: { $in: [GENDERS.MALE, GENDERS.FEMALE] } },
              { $expr: { $eq: [currentUser.genderPreference, GENDER_PREFERENCES.BOTH] } },
            ],
          },
        ],
      },
      {
        $or: [
          { incognitoMode: { $ne: true } },
          { likes: currentUser._id },
        ],
      },
    ];
  }

  async getUserMatches(userId) {
    const user = await userRepository.findById(userId, "matches", [
      { path: "matches", select: "name image bio age" },
    ]);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return (user.matches || []).map((matchedUser) => new UserDto(matchedUser));
  }

  async handleSwipeRight(userId, likedUserId) {
    if (userId.toString() === likedUserId.toString()) {
      throw new AppError("You cannot like yourself", 400);
    }

    const currentUser = await userRepository.findById(userId);
    const likedUser = await userRepository.findById(likedUserId);

    if (!likedUser) {
      throw new AppError("Liked user not found", 404);
    }

    if (currentUser.matches.includes(likedUserId)) {
      throw new AppError("Already matched with this user", 400);
    }

    let isMatch = false;

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      currentUser.swipeHistory.push({ user: likedUserId, action: SWIPE_ACTIONS.LIKE });
      if (currentUser.swipeHistory.length > 15) {
        currentUser.swipeHistory.shift();
      }

      if (likedUser.likes.includes(userId)) {
        currentUser.matches.push(likedUserId);
        likedUser.matches.push(currentUser._id);
        await Promise.all([userRepository.save(currentUser), userRepository.save(likedUser)]);
        isMatch = true;

        this._emitMatchCelebration(currentUser, likedUser);
      } else {
        await userRepository.save(currentUser);
      }
    }

    return new SwipeResultDto({
      user: currentUser,
      isMatch,
      matchedUser: isMatch ? likedUser : null,
      action: "right",
    });
  }

  async handleSwipeLeft(userId, dislikedUserId) {
    if (userId.toString() === dislikedUserId.toString()) {
      throw new AppError("Cannot dislike yourself", 400);
    }

    const currentUser = await userRepository.findById(userId);
    if (!currentUser) {
      throw new AppError("Current user not found", 404);
    }

    const dislikedUser = await userRepository.findById(dislikedUserId);
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

      currentUser.swipeHistory.push({ user: dislikedUserId, action: SWIPE_ACTIONS.NOPE });
      if (currentUser.swipeHistory.length > 15) {
        currentUser.swipeHistory.shift();
      }

      await userRepository.save(currentUser);
    }

    return new SwipeResultDto({
      user: currentUser,
      isMatch: false,
      matchedUser: null,
      action: "left",
    });
  }

  async handleSuperLike(userId, targetUserId) {
    if (userId.toString() === targetUserId.toString()) {
      throw new AppError("Cannot super like yourself", 400);
    }

    const currentUser = await userRepository.findById(userId);
    const targetUser = await userRepository.findById(targetUserId);

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
        action: SWIPE_ACTIONS.SUPERLIKE,
      });
      if (currentUser.swipeHistory.length > 15) {
        currentUser.swipeHistory.shift();
      }

      if (targetUser.likes.includes(userId)) {
        currentUser.matches.push(targetUserId);
        targetUser.matches.push(currentUser._id);
        await Promise.all([userRepository.save(currentUser), userRepository.save(targetUser)]);
        isMatch = true;

        this._emitMatchCelebration(currentUser, targetUser);
      } else {
        await userRepository.save(currentUser);
        const targetSocketId = getReceiverSocketId(targetUserId);
        if (targetSocketId) {
          io.to(targetSocketId).emit(SOCKET_EVENTS.SUPER_LIKE_RECEIVED, {
            sender: {
              _id: currentUser._id,
              name: currentUser.name,
              image: currentUser.image,
            },
          });
        }
      }
    }

    return new SwipeResultDto({
      user: currentUser,
      isMatch,
      matchedUser: isMatch ? targetUser : null,
      action: "superlike",
    });
  }

  async getUserProfiles(userId) {
    const currentUser = await userRepository.findById(userId);
    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    const filter = this._getProfileMatchFilter(currentUser);
    const users = await userRepository.find(
      { $and: filter },
      "name age gender bio image interests superLikes",
      10
    );

    return users.map((user) => {
      const isSuperLiked = user.superLikes?.some(
        (id) => id.toString() === currentUser._id.toString()
      ) || false;
      return new ProfileDto(user, isSuperLiked);
    });
  }

  async getExploreProfiles(userId, interest) {
    const currentUser = await userRepository.findById(userId);
    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    if (!interest) {
      throw new AppError("Interest is required for explore feed", 400);
    }

    const filter = this._getProfileMatchFilter(currentUser);
    filter.push({ interests: { $regex: new RegExp(`^${interest}$`, "i") } });

    const users = await userRepository.find(
      { $and: filter },
      "name age gender bio image interests superLikes",
      10
    );

    return users.map((user) => {
      const isSuperLiked = user.superLikes?.some(
        (id) => id.toString() === currentUser._id.toString()
      ) || false;
      return new ProfileDto(user, isSuperLiked);
    });
  }

  async handleRewind(userId) {
    const currentUser = await userRepository.findById(userId);
    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    if (!currentUser.swipeHistory || currentUser.swipeHistory.length === 0) {
      throw new AppError("No swipe history to rewind", 400);
    }

    const lastSwipe = currentUser.swipeHistory.pop();
    const targetUserId = lastSwipe.user;
    const action = lastSwipe.action;

    const targetUser = await userRepository.findById(
      targetUserId,
      "name age gender bio image interests superLikes matches"
    );
    if (!targetUser) {
      throw new AppError("Target user not found", 404);
    }

    if (action === SWIPE_ACTIONS.LIKE || action === SWIPE_ACTIONS.SUPERLIKE) {
      currentUser.likes = (currentUser.likes || []).filter(
        (id) => id.toString() !== targetUserId.toString(),
      );
      currentUser.superLikes = (currentUser.superLikes || []).filter(
        (id) => id.toString() !== targetUserId.toString(),
      );
      currentUser.matches = (currentUser.matches || []).filter(
        (id) => id.toString() !== targetUserId.toString(),
      );
      targetUser.matches = (targetUser.matches || []).filter(
        (id) => id.toString() !== userId.toString(),
      );

      await Promise.all([userRepository.save(currentUser), userRepository.save(targetUser)]);
    } else if (action === SWIPE_ACTIONS.NOPE) {
      currentUser.dislikes = (currentUser.dislikes || []).filter(
        (id) => id.toString() !== targetUserId.toString(),
      );

      await userRepository.save(currentUser);
    }

    const isSuperLiked = targetUser.superLikes?.some(
      (id) => id.toString() === currentUser._id.toString()
    ) || false;

    return new ProfileDto(targetUser, isSuperLiked);
  }

  async getUserLikes(userId) {
    const user = await userRepository.findById(userId, "likes matches", [
      { path: "likes", select: "name image bio age interests" },
    ]);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const matchesSet = new Set(user.matches.map((m) => m.toString()));
    const likesFiltered = (user.likes || []).filter(
      (likedUser) => !matchesSet.has(likedUser._id.toString())
    );
    return likesFiltered.map((likedUser) => new UserDto(likedUser));
  }

  async getWhoLikedMe(userId) {
    const currentUser = await userRepository.findById(userId);
    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    const swipedUserIds = [
      ...currentUser.likes.map((id) => id.toString()),
      ...currentUser.dislikes.map((id) => id.toString()),
      ...currentUser.matches.map((id) => id.toString()),
    ];

    const users = await userRepository.find(
      {
        likes: currentUser._id,
        _id: { $nin: swipedUserIds },
      },
      "name age gender bio image interests"
    );

    return users.map((user) => new UserDto(user));
  }
}

module.exports = new MatchService();
