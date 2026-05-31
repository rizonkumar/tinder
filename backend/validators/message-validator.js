const Joi = require("joi");
const { MESSAGE_TYPES } = require("../constants/message-types");
const { DATE_STATUSES } = require("../constants/date-statuses");

// Mongo ID regex helper
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const sendMessageSchema = Joi.object({
  receiverId: Joi.string().regex(objectIdRegex).required().messages({
    "any.required": "Receiver ID is required",
    "string.pattern.base": "Invalid receiver ID format",
  }),
  content: Joi.string().trim().allow("").optional(),
  messageType: Joi.string()
    .valid(...Object.values(MESSAGE_TYPES))
    .default(MESSAGE_TYPES.TEXT)
    .optional(),
  mediaUrl: Joi.string().trim().allow("").optional(),
  dateInfo: Joi.object({
    date: Joi.string().trim().required(),
    time: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
    activity: Joi.string().trim().required(),
    status: Joi.string()
      .valid(...Object.values(DATE_STATUSES))
      .default(DATE_STATUSES.PENDING)
      .optional(),
  }).optional(),
}).custom((value, helpers) => {
  // Custom business rules: text messages must have non-empty content if there's no mediaUrl
  if (value.messageType === MESSAGE_TYPES.TEXT && (!value.content || !value.content.trim())) {
    return helpers.error("any.custom", {
      message: "Message content cannot be empty for text messages",
    });
  }
  // Date proposals must contain dateInfo
  if (value.messageType === MESSAGE_TYPES.DATE_PROPOSAL && !value.dateInfo) {
    return helpers.error("any.custom", {
      message: "Date info is required for date proposals",
    });
  }
  return value;
});

const respondProposalSchema = Joi.object({
  messageId: Joi.string().regex(objectIdRegex).required().messages({
    "any.required": "Message ID is required",
    "string.pattern.base": "Invalid message ID format",
  }),
  status: Joi.string()
    .valid(DATE_STATUSES.ACCEPTED, DATE_STATUSES.DECLINED)
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Status must be accepted or declined",
    }),
});

module.exports = {
  sendMessageSchema,
  respondProposalSchema,
};
