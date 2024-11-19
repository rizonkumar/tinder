const messageService = require("../services/message-service");
const AppError = require("../utils/appError");
const sendResponse = require("../utils/responseHandler.JS");

exports.sendMessage = async (req, res, next) => {
  try {
    const { content, receiverId } = req.body;

    if (!receiverId) {
      throw new AppError("Receiver ID is required", 400);
    }

    const message = await messageService.sendMessage(
      req.user._id,
      receiverId,
      content
    );

    sendResponse(res, 200, message, null, "Message sent successfully");
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error sending message",
    });
  }
};

exports.getConversation = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const conversation = await messageService.getConversation(
      req.user._id,
      userId
    );

    // Get unread count after marking messages as read
    const unreadCount = await messageService.getUnreadCount(req.user._id);

    sendResponse(
      res,
      200,
      { conversation, unreadCount },
      null,
      "Conversation retrieved successfully"
    );
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error retrieving conversation",
    });
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await messageService.getUnreadCount(req.user._id);

    sendResponse(
      res,
      200,
      { unreadCount },
      null,
      "Unread count retrieved successfully"
    );
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error retrieving unread count",
    });
  }
};
