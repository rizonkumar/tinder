const User = require("../models/user-model");
const AppError = require("../utils/appError");

const signInToken = require("../utils/signInToken");

class AuthService {
  async signup(userData) {
    const { name, email, password, age, gender, genderPreference } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
    });

    // User age should be greater than 18
    if (user.age < 18) {
      throw new AppError("User age should be greater than 18", 400);
    }

    // Generate token
    const token = signInToken(user._id);

    // Remove password from response
    user.password = undefined;

    return { user, token };
  }

  async sign(email, password) {
    // Check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      throw new AppError("Incorrect password", 401);
    }

    const token = signInToken(user._id);

    // Remove password before sending
    user.password = undefined;

    return { user, token };
  }

  async signOut() {
    return true;
  }

  async getUserInformation(userId) {
    const user = await User.findById(userId)
      .select("-password")
      .populate("matches", "name image")
      .populate("likes", "name image")
      .populate("dislikes", "name image");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

module.exports = new AuthService();
