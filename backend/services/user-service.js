import cloudinary from "../config/cloudinary.js";
import userRepository from "../repositories/user-repository.js";
import AppError from "../utils/appError.js";
import UserDto from "../dtos/user-dto.js";

class UserService {
  async updateProfile(userId, userData) {
    const { image, ...otherData } = userData;
    let updatedData = otherData;

    if (image && image.startsWith("data:image")) {
      const updatedResponse = await cloudinary.uploader.upload(image);
      updatedData.image = updatedResponse.secure_url;
    }

    const updatedUser = await userRepository.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return new UserDto(updatedUser);
  }

  async toggleIncognito(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    user.incognitoMode = !user.incognitoMode;
    await userRepository.save(user);
    return new UserDto(user);
  }

  async toggleGold(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    user.isGold = !user.isGold;
    await userRepository.save(user);
    return new UserDto(user);
  }

  async getStats(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const likesSent = user.likes?.length || 0;
    const dislikesSent = user.dislikes?.length || 0;
    const superLikesSent = user.superLikes?.length || 0;
    const matchesCount = user.matches?.length || 0;
    const totalSwipes = likesSent + dislikesSent;

    const likesReceived = await userRepository.countDocuments({ likes: userId });

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

export default new UserService();
