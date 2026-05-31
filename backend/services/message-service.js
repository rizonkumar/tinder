const messageRepository = require("../repositories/message-repository");
const AppError = require("../utils/appError");
const { getReceiverSocketId, io } = require("../socket/socket");
const cloudinary = require("../config/cloudinary");
const { SOCKET_EVENTS } = require("../constants/socket-events");
const { MESSAGE_TYPES } = require("../constants/message-types");
const { DATE_STATUSES } = require("../constants/date-statuses");
const MessageDto = require("../dtos/message-dto");

class MessageService {
  async sendMessage(senderId, receiverId, content, messageType = MESSAGE_TYPES.TEXT, mediaUrl = "", dateInfo = null) {
    if (messageType === MESSAGE_TYPES.TEXT && (!content || !content.trim())) {
      throw new AppError("Message content cannot be empty for text messages", 400);
    }

    let finalMediaUrl = mediaUrl;
    if (mediaUrl && mediaUrl.startsWith("data:")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(mediaUrl, {
          resource_type: "auto",
        });
        finalMediaUrl = uploadResponse.secure_url;
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw new AppError("Failed to upload attachment", 500);
      }
    }

    let messageContent = content ? content.trim() : "";
    if (!messageContent) {
      if (messageType === MESSAGE_TYPES.IMAGE) {
        messageContent = "Sent an image 📸";
      } else if (messageType === MESSAGE_TYPES.DATE_PROPOSAL) {
        messageContent = `Proposed a date: ${dateInfo?.activity || "activity"}`;
      } else {
        messageContent = "Sent an attachment";
      }
    }

    const newMessage = await messageRepository.create({
      sender: senderId,
      receiver: receiverId,
      content: messageContent,
      messageType,
      mediaUrl: finalMediaUrl,
      dateInfo,
    });

    const populatedMessage = await messageRepository.populate(newMessage, [
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);

    const mappedMessage = new MessageDto(populatedMessage);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(SOCKET_EVENTS.NEW_MESSAGE, mappedMessage);
    }

    return mappedMessage;
  }

  async getConversation(currentUserId, otherUserId) {
    const messages = await messageRepository.findConversation(currentUserId, otherUserId, [
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);

    await messageRepository.markAsRead(otherUserId, currentUserId);

    return messages.map((message) => new MessageDto(message));
  }

  async getUnreadCount(userId) {
    return await messageRepository.countUnread(userId);
  }

  async respondToDateProposal(messageId, userId, status) {
    if (![DATE_STATUSES.ACCEPTED, DATE_STATUSES.DECLINED].includes(status)) {
      throw new AppError("Invalid status. Must be accepted or declined", 400);
    }

    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    }

    if (message.messageType !== MESSAGE_TYPES.DATE_PROPOSAL) {
      throw new AppError("Message is not a date proposal", 400);
    }

    // Verify authorized user is responding (the receiver)
    if (message.receiver.toString() !== userId.toString()) {
      throw new AppError("You are not authorized to respond to this proposal", 403);
    }

    message.dateInfo.status = status;
    await messageRepository.save(message);

    const populatedMessage = await messageRepository.populate(message, [
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);

    const mappedMessage = new MessageDto(populatedMessage);

    const senderSocketId = getReceiverSocketId(message.sender._id);
    const receiverSocketId = getReceiverSocketId(message.receiver._id);

    const payload = {
      messageId: message._id,
      status,
      message: mappedMessage,
    };

    if (senderSocketId) {
      io.to(senderSocketId).emit(SOCKET_EVENTS.DATE_STATUS_UPDATE, payload);
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(SOCKET_EVENTS.DATE_STATUS_UPDATE, payload);
    }

    return mappedMessage;
  }

  async searchMessages(currentUserId, otherUserId, query) {
    const messages = await messageRepository.searchConversation(
      currentUserId,
      otherUserId,
      query,
      [
        { path: "sender", select: "name image" },
        { path: "receiver", select: "name image" },
      ]
    );

    return messages.map((message) => new MessageDto(message));
  }
}

module.exports = new MessageService();
