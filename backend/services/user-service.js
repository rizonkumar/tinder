const cloudinary = require("../config/cloudinary");
const User = require("../models/user-model");
const AppError = require("../utils/appError");

class UserService {
  async updateProfile(userId, userData) {
    const { image, ...otherData } = userData;
    let updatedData = otherData;

    if (image && image.startsWith("data:image")) {
      const updatedResponse = await cloudinary.uploader.upload(image);
      updatedData.image = updatedResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return updatedUser;
  }

  async toggleIncognito(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    user.incognitoMode = !user.incognitoMode;
    await user.save();
    return user;
  }

  async toggleGold(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    user.isGold = !user.isGold;
    await user.save();
    return user;
  }

  async getStats(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const likesSent = user.likes?.length || 0;
    const dislikesSent = user.dislikes?.length || 0;
    const superLikesSent = user.superLikes?.length || 0;
    const matchesCount = user.matches?.length || 0;
    const totalSwipes = likesSent + dislikesSent;

    const likesReceived = await User.countDocuments({ likes: userId });

    const matchRate =
      totalSwipes > 0 ? Math.round((matchesCount / totalSwipes) * 100) : 0;

    return {
      likesSent,
      dislikesSent,
      superLikesSent,
      matchesCount,
      totalSwipes,
      likesReceived,
      matchRate,
    };
  }
}

module.exports = new UserService();
