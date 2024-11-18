const Joi = require("joi");
const User = require("../models/user-model");

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().min(18).required(),
  gender: Joi.string().valid("male", "female").required(),
  genderPreference: Joi.string().valid("male", "female", "both").required(),
});

exports.validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

exports.validateSignIn = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      success: false,
      message: "Email and password are required",
    });
  }
  next();
};

exports.protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }

    const currentUser = await User.findById(decoded.id);
    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
