const cloudinary = require("../config/cloudinary");
const User = require("../models/user-model");
const AppError = require("../utils/appError");

class UserService {
  async updateProfile(userId, userData) {
    try {
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
    } catch (error) {
      console.error("Error updating profile:", error);

      throw new AppError(error.message || "Error updating profile", 500);
    }
  }
}

module.exports = new UserService();
