import asyncHandler from "../utils/asyncHandler.js";
import messageService from "../services/message-service.js";
import aiService from "../services/ai-service.js";
import linkPreviewService from "../services/link-preview-service.js";
import sendResponse from "../utils/responseHandler.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const {
    content,
    receiverId,
    messageType,
    mediaUrl,
    dateInfo,
    gameInfo,
    replyTo,
    callInfo,
    isForwarded,
    expireInSeconds,
  } = req.body;

  const message = await messageService.sendMessage(req.user._id, receiverId, {
    content,
    messageType,
    mediaUrl,
    dateInfo,
    gameInfo,
    replyTo,
    callInfo,
    isForwarded,
    expireInSeconds,
  });

  sendResponse(res, 200, message, "Message sent successfully");
});

export const getConversation = asyncHandler(async (req, res) => {
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

export const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await messageService.getUnreadCount(req.user._id);

  sendResponse(
    res,
    200,
    { unreadCount },
    "Unread count retrieved successfully"
  );
});

export const generateIcebreakers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const icebreakers = await aiService.generateIcebreakers(req.user._id, userId);
  sendResponse(res, 200, icebreakers, "Icebreakers generated successfully");
});

export const respondToDateProposal = asyncHandler(async (req, res) => {
  const { messageId, status } = req.body;

  const updatedMessage = await messageService.respondToDateProposal(
    messageId,
    req.user._id,
    status
  );

  sendResponse(res, 200, updatedMessage, "Date response saved successfully");
});

export const getConfirmedDates = asyncHandler(async (req, res) => {
  const dates = await messageService.getConfirmedDates(req.user._id);
  sendResponse(res, 200, dates, "Confirmed dates retrieved successfully");
});

export const generateSmartReplies = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const replies = await aiService.generateSmartReplies(req.user._id, userId);
  sendResponse(res, 200, replies, "Smart replies generated successfully");
});

export const searchMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { query } = req.query;

  const results = await messageService.searchMessages(
    req.user._id,
    userId,
    query.trim()
  );

  sendResponse(res, 200, results, "Messages searched successfully");
});

export const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  const message = await messageService.editMessage(
    messageId,
    req.user._id,
    content
  );

  sendResponse(res, 200, message, "Message edited successfully");
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { deleteForEveryone } = req.body;

  const message = await messageService.deleteMessage(
    messageId,
    req.user._id,
    deleteForEveryone
  );

  sendResponse(res, 200, message, "Message deleted successfully");
});

export const clearConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  await messageService.clearConversation(req.user._id, userId);

  sendResponse(res, 200, null, "Conversation cleared successfully");
});

export const toggleReaction = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { emoji } = req.body;

  const message = await messageService.toggleReaction(
    messageId,
    req.user._id,
    emoji
  );

  sendResponse(res, 200, message, "Reaction updated successfully");
});

export const getLinkPreview = asyncHandler(async (req, res) => {
  const { url } = req.query;

  const preview = await linkPreviewService.getLinkPreview(url);

  sendResponse(res, 200, preview, "Link preview retrieved successfully");
});

export const togglePin = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { isPinned } = req.body;

  const message = await messageService.togglePin(
    messageId,
    req.user._id,
    isPinned
  );

  sendResponse(res, 200, message, "Message pin updated successfully");
});

export const markConversationAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  await messageService.markConversationAsRead(req.user._id, userId);
  const unreadCount = await messageService.getUnreadCount(req.user._id);

  sendResponse(
    res,
    200,
    { unreadCount },
    "Conversation marked as read successfully"
  );
});

export const respondToGameProposal = asyncHandler(async (req, res) => {
  const { messageId, guessIndex } = req.body;

  const updatedMessage = await messageService.respondToGameProposal(
    messageId,
    req.user._id,
    guessIndex
  );

  sendResponse(res, 200, updatedMessage, "Game response saved successfully");
});
