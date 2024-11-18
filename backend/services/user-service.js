const { default: cloudinary } = require("../config/cloudinary");
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

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }
    return updatedUser;
  }
}

module.exports = new UserService();
