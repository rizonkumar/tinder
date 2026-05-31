const Joi = require("joi");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const swipeParamsSchema = Joi.object({
  likedUserId: Joi.string().regex(objectIdRegex).optional().messages({
    "string.pattern.base": "Invalid target user ID format",
  }),
  dislikedUserId: Joi.string().regex(objectIdRegex).optional().messages({
    "string.pattern.base": "Invalid target user ID format",
  }),
});

const exploreQuerySchema = Joi.object({
  interest: Joi.string().trim().required().messages({
    "any.required": "Interest is required for explore feed",
    "string.empty": "Interest cannot be empty",
  }),
});

module.exports = {
  swipeParamsSchema,
  exploreQuerySchema,
};
