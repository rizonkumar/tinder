const Joi = require("joi");
const { GENDERS, GENDER_PREFERENCES } = require("../constants/genders");

const signupSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
  email: Joi.string().trim().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
  age: Joi.number().integer().min(18).required().messages({
    "any.required": "Age is required",
    "number.min": "User must be 18 years or older",
  }),
  gender: Joi.string()
    .valid(...Object.values(GENDERS))
    .required()
    .messages({
      "any.required": "Gender is required",
      "any.only": "Gender must be male or female",
    }),
  genderPreference: Joi.string()
    .valid(...Object.values(GENDER_PREFERENCES))
    .required()
    .messages({
      "any.required": "Gender preference is required",
      "any.only": "Gender preference must be male, female, or both",
    }),
});

const signinSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

module.exports = {
  signupSchema,
  signinSchema,
};
