const userRepository = require("../repositories/user-repository");
const AppError = require("../utils/appError");
const signInToken = require("../utils/signInToken");
const AuthDto = require("../dtos/auth-dto");
const UserDto = require("../dtos/user-dto");

class AuthService {
  async signup(userData) {
    const { name, email, password, age, gender, genderPreference } = userData;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    if (age < 18) {
      throw new AppError("User age should be greater than 18", 400);
    }

    const user = await userRepository.create({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
    });

    const token = signInToken(user._id);

    return new AuthDto(user, token);
  }

  async signIn(email, password) {
    const user = await userRepository.findByEmail(email, "+password");

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      throw new AppError("Incorrect password", 401);
    }

    const token = signInToken(user._id);

    return new AuthDto(user, token);
  }

  async signOut() {
    return true;
  }

  async getUserInformation(userId) {
    const user = await userRepository.findById(userId, "-password", [
      { path: "matches", select: "name image" },
      { path: "likes", select: "name image" },
      { path: "dislikes", select: "name image" },
    ]);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return new UserDto(user);
  }
}

module.exports = new AuthService();
