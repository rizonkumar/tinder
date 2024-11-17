const { signIn } = require("../controllers/auth-controller");
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

    // Generate token
    const token = signInToken(user._id);

    // Remove password from response
    user.password = undefined;

    return { user, token };
  }
}

module.exports = new AuthService();
