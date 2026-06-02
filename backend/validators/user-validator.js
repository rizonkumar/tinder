import Joi from "joi";
import { GENDERS, GENDER_PREFERENCES } from "../constants/genders.js";
import { PROFILE_TONES } from "../constants/profile.js";

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().optional(),
  email: Joi.string().trim().email().optional(),
  password: Joi.string().min(6).optional(),
  age: Joi.number().integer().min(18).optional(),
  gender: Joi.string().valid(...Object.values(GENDERS)).optional(),
  genderPreference: Joi.string().valid(...Object.values(GENDER_PREFERENCES)).optional(),
  bio: Joi.string().trim().allow("").optional(),
  image: Joi.string().trim().allow("").optional(),
  interests: Joi.array().items(Joi.string().trim()).optional(),
});

const enhanceProfileSchema = Joi.object({
  tone: Joi.string().valid(...Object.values(PROFILE_TONES)).required(),
});

export { updateProfileSchema, enhanceProfileSchema };
