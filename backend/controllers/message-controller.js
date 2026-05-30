const asyncHandler = require("../utils/asyncHandler");
const messageService = require("../services/message-service");
const aiService = require("../services/ai-service");
const AppError = require("../utils/appError");
const sendResponse = require("../utils/responseHandler");

exports.sendMessage = asyncHandler(async (req, res) => {
  const { content, receiverId, messageType, mediaUrl } = req.body;

  if (!receiverId) {
    throw new AppError("Receiver ID is required", 400);
  }

  const message = await messageService.sendMessage(
    req.user._id,
    receiverId,
    content,
    messageType,
    mediaUrl
  );

  sendResponse(res, 200, message, null, "Message sent successfully");
});

exports.getConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const conversation = await messageService.getConversation(req.user._id, userId);
  const unreadCount = await messageService.getUnreadCount(req.user._id);

  sendResponse(
    res,
    200,
    { conversation, unreadCount },
    null,
    "Conversation retrieved successfully"
  );
});

exports.getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await messageService.getUnreadCount(req.user._id);

  sendResponse(
    res,
    200,
    { unreadCount },
    null,
    "Unread count retrieved successfully"
  );
});

exports.generateIcebreakers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new AppError("Target User ID is required", 400);
  }

  const icebreakers = await aiService.generateIcebreakers(req.user._id, userId);
  sendResponse(res, 200, icebreakers, null, "Icebreakers generated successfully");
});
