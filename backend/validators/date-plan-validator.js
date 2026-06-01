import Joi from "joi";

const voteCategorySchema = Joi.object({
  category: Joi.string()
    .valid("Coffee", "Dinner", "Drinks", "Outdoor")
    .required()
    .messages({
      "any.required": "Category is required",
      "any.only": "Category must be Coffee, Dinner, Drinks, or Outdoor",
    }),
});

const proposeVenueSchema = Joi.object({
  title: Joi.string().trim().min(1).required().messages({
    "any.required": "Venue title is required",
    "string.empty": "Venue title cannot be empty",
  }),
  location: Joi.string().trim().min(1).required().messages({
    "any.required": "Venue location is required",
    "string.empty": "Venue location cannot be empty",
  }),
});

const voteVenueSchema = Joi.object({
  venueId: Joi.string().trim().required().messages({
    "any.required": "Venue ID is required",
  }),
});

const proposeDateTimeSchema = Joi.object({
  date: Joi.string().trim().min(1).required().messages({
    "any.required": "Date is required",
    "string.empty": "Date cannot be empty",
  }),
  time: Joi.string().trim().min(1).required().messages({
    "any.required": "Time is required",
    "string.empty": "Time cannot be empty",
  }),
});

const voteDateTimeSchema = Joi.object({
  dateTimeId: Joi.string().trim().required().messages({
    "any.required": "Date time ID is required",
  }),
});

const finalizeDateSchema = Joi.object({
  venueId: Joi.string().trim().required().messages({
    "any.required": "Venue ID is required",
  }),
  dateTimeId: Joi.string().trim().required().messages({
    "any.required": "Date time ID is required",
  }),
});

export {
  voteCategorySchema,
  proposeVenueSchema,
  voteVenueSchema,
  proposeDateTimeSchema,
  voteDateTimeSchema,
  finalizeDateSchema,
};
