const asyncHandler = require("../utils/asyncHandler");
const messageService = require("../services/message-service");
const aiService = require("../services/ai-service");
const sendResponse = require("../utils/responseHandler");

exports.sendMessage = asyncHandler(async (req, res) => {
  const { content, receiverId, messageType, mediaUrl, dateInfo } = req.body;

  const message = await messageService.sendMessage(
    req.user._id,
    receiverId,
    content,
    messageType,
    mediaUrl,
    dateInfo
  );

  sendResponse(res, 200, message, "Message sent successfully");
});

exports.getConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const conversation = await messageService.getConversation(req.user._id, userId);
  const unreadCount = await messageService.getUnreadCount(req.user._id);

  sendResponse(
    res,
    200,
    { conversation, unreadCount },
    "Conversation retrieved successfully"
  );
});

exports.getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await messageService.getUnreadCount(req.user._id);

  sendResponse(
    res,
    200,
    { unreadCount },
    "Unread count retrieved successfully"
  );
});

exports.generateIcebreakers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const icebreakers = await aiService.generateIcebreakers(req.user._id, userId);
  sendResponse(res, 200, icebreakers, "Icebreakers generated successfully");
});

exports.respondToDateProposal = asyncHandler(async (req, res) => {
  const { messageId, status } = req.body;

  const updatedMessage = await messageService.respondToDateProposal(
    messageId,
    req.user._id,
    status
  );

  sendResponse(res, 200, updatedMessage, "Date response saved successfully");
});

exports.generateSmartReplies = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const replies = await aiService.generateSmartReplies(req.user._id, userId);
  sendResponse(res, 200, replies, "Smart replies generated successfully");
});

exports.searchMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { query } = req.query;

  const results = await messageService.searchMessages(
    req.user._id,
    userId,
    query.trim()
  );

  sendResponse(res, 200, results, "Messages searched successfully");
});
