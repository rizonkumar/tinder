import messageRepository from "../repositories/message-repository.js";
import AppError from "../utils/appError.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import cloudinary from "../config/cloudinary.js";
import config from "../config/env.js";
import { SOCKET_EVENTS } from "../constants/socket-events.js";
import { MESSAGE_TYPES } from "../constants/message-types.js";
import { DATE_STATUSES } from "../constants/date-statuses.js";
import { MESSAGE_POPULATE } from "../constants/message-populate.js";
import MessageDto from "../dtos/message-dto.js";

class MessageService {
  async sendMessage(senderId, receiverId, data = {}) {
    const {
      content,
      messageType = MESSAGE_TYPES.TEXT,
      mediaUrl = "",
      dateInfo = null,
      gameInfo = null,
      replyTo = null,
      callInfo = null,
      isForwarded = false,
      expireInSeconds = null,
    } = data;

    if (messageType === MESSAGE_TYPES.TEXT && (!content || !content.trim())) {
      throw new AppError("Message content cannot be empty for text messages", 400);
    }

    const replyToId = await this._resolveReplyTo(replyTo, senderId, receiverId);
    const finalMediaUrl = await this._resolveMediaUrl(mediaUrl);

    let messageContent = content ? content.trim() : "";
    if (!messageContent) {
      messageContent = this._defaultContentFor(messageType, dateInfo);
    }

    const newMessage = await messageRepository.create({
      sender: senderId,
      receiver: receiverId,
      content: messageContent,
      messageType,
      mediaUrl: finalMediaUrl,
      dateInfo,
      gameInfo,
      replyTo: replyToId,
      callInfo,
      isForwarded,
      expiresAt: this._resolveExpiry(expireInSeconds),
    });

    const populatedMessage = await messageRepository.populate(
      newMessage,
      MESSAGE_POPULATE
    );

    const senderDto = new MessageDto(populatedMessage, senderId);
    const receiverDto = new MessageDto(populatedMessage, receiverId);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(SOCKET_EVENTS.NEW_MESSAGE, receiverDto);
    }

    return senderDto;
  }

  async _resolveReplyTo(replyTo, senderId, receiverId) {
    if (!replyTo) return null;

    const original = await messageRepository.findById(replyTo);
    if (!original) {
      throw new AppError("Cannot reply to a message that no longer exists", 404);
    }

    const sender = original.sender.toString();
    const receiver = original.receiver.toString();
    const isWithinConversation =
      (sender === senderId.toString() && receiver === receiverId.toString()) ||
      (sender === receiverId.toString() && receiver === senderId.toString());

    if (!isWithinConversation) {
      throw new AppError("Cannot reply to a message outside this conversation", 403);
    }

    return original._id;
  }

  _resolveExpiry(expireInSeconds) {
    if (!expireInSeconds || expireInSeconds <= 0) return null;
    return new Date(Date.now() + expireInSeconds * 1000);
  }

  async _resolveMediaUrl(mediaUrl) {
    if (!mediaUrl || !mediaUrl.startsWith("data:")) {
      return mediaUrl;
    }

    try {
      const uploadResponse = await cloudinary.uploader.upload(mediaUrl, {
        resource_type: "auto",
      });
      return uploadResponse.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      const detail =
        config.env === "development" && error?.message ? ` (${error.message})` : "";
      throw new AppError(
        `We couldn't upload that attachment. Please try a smaller file.${detail}`,
        500
      );
    }
  }

  _defaultContentFor(messageType, dateInfo) {
    switch (messageType) {
      case MESSAGE_TYPES.IMAGE:
        return "Sent an image 📸";
      case MESSAGE_TYPES.VOICE_NOTE:
        return "Sent a voice note 🎤";
      case MESSAGE_TYPES.DATE_PROPOSAL:
        return `Proposed a date: ${dateInfo?.activity || "activity"}`;
      case MESSAGE_TYPES.GAME_TTAL:
        return "Challenged you to Two Truths & a Lie! 🎮";
      default:
        return "Sent an attachment";
    }
  }

  async getConversation(currentUserId, otherUserId) {
    const messages = await messageRepository.findConversation(
      currentUserId,
      otherUserId,
      MESSAGE_POPULATE
    );

    await messageRepository.markAsRead(otherUserId, currentUserId);

    const otherSocketId = getReceiverSocketId(otherUserId);
    if (otherSocketId) {
      io.to(otherSocketId).emit(SOCKET_EVENTS.MESSAGES_READ, {
        readerId: currentUserId,
        readAt: new Date(),
      });
    }

    return messages.map((message) => new MessageDto(message, currentUserId));
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

    if (message.receiver.toString() !== userId.toString()) {
      throw new AppError("You are not authorized to respond to this proposal", 403);
    }

    message.dateInfo.status = status;
    await messageRepository.save(message);

    const populatedMessage = await messageRepository.populate(
      message,
      MESSAGE_POPULATE
    );

    const senderSocketId = getReceiverSocketId(message.sender._id);
    const receiverSocketId = getReceiverSocketId(message.receiver._id);

    const payload = (recipientId) => ({
      messageId: message._id,
      status,
      message: new MessageDto(populatedMessage, recipientId),
    });

    if (senderSocketId) {
      io.to(senderSocketId).emit(SOCKET_EVENTS.DATE_STATUS_UPDATE, payload(message.sender._id));
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(SOCKET_EVENTS.DATE_STATUS_UPDATE, payload(message.receiver._id));
    }

    return new MessageDto(populatedMessage, userId);
  }

  async getConfirmedDates(userId) {
    const messages = await messageRepository.findConfirmedDates(
      userId,
      MESSAGE_POPULATE
    );

    return messages.map((message) => {
      const proposedByMe = message.sender._id.toString() === userId.toString();
      const partner = proposedByMe ? message.receiver : message.sender;
      return {
        id: message._id,
        partner: {
          _id: partner._id,
          name: partner.name,
          image: partner.image,
        },
        activity: message.dateInfo.activity,
        date: message.dateInfo.date,
        time: message.dateInfo.time,
        location: message.dateInfo.location,
        status: message.dateInfo.status,
        proposedByMe,
        createdAt: message.createdAt,
      };
    });
  }

  async searchMessages(currentUserId, otherUserId, query) {
    const messages = await messageRepository.searchConversation(
      currentUserId,
      otherUserId,
      query,
      MESSAGE_POPULATE
    );

    return messages.map((message) => new MessageDto(message, currentUserId));
  }

  async editMessage(messageId, userId, content) {
    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    }
    if (message.sender.toString() !== userId.toString()) {
      throw new AppError("You are not authorized to edit this message", 403);
    }
    if (message.isDeleted) {
      throw new AppError("Cannot edit a deleted message", 400);
    }
    message.content = content.trim();
    message.isEdited = true;
    await messageRepository.save(message);

    const populated = await messageRepository.populate(message, MESSAGE_POPULATE);
    const senderDto = new MessageDto(populated, message.sender._id);
    const receiverDto = new MessageDto(populated, message.receiver._id);

    const receiverSocket = getReceiverSocketId(message.receiver._id);
    if (receiverSocket) {
      io.to(receiverSocket).emit(SOCKET_EVENTS.MESSAGE_EDITED, receiverDto);
    }
    return senderDto;
  }

  async deleteMessage(messageId, userId, deleteForEveryone = false) {
    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    }
    if (deleteForEveryone) {
      if (message.sender.toString() !== userId.toString()) {
        throw new AppError("You are not authorized to delete this message for everyone", 403);
      }
      message.isDeleted = true;
      message.content = "This message was deleted";
      message.mediaUrl = "";
      message.isPinned = false;
      message.pinnedBy = null;
      await messageRepository.save(message);

      const populated = await messageRepository.populate(message, MESSAGE_POPULATE);
      const senderDto = new MessageDto(populated, message.sender._id);
      const receiverDto = new MessageDto(populated, message.receiver._id);

      const receiverSocket = getReceiverSocketId(message.receiver._id);
      if (receiverSocket) {
        io.to(receiverSocket).emit(SOCKET_EVENTS.MESSAGE_DELETED, receiverDto);
      }
      return senderDto;
    } else {
      if (
        message.sender.toString() !== userId.toString() &&
        message.receiver.toString() !== userId.toString()
      ) {
        throw new AppError("You are not authorized to delete this message", 403);
      }
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await messageRepository.save(message);
      }
      const populated = await messageRepository.populate(message, MESSAGE_POPULATE);
      return new MessageDto(populated, userId);
    }
  }

  async clearConversation(userId, otherUserId) {
    await messageRepository.clearConversation(userId, otherUserId);
    const userSocket = getReceiverSocketId(userId);
    if (userSocket) {
      io.to(userSocket).emit(SOCKET_EVENTS.CONVERSATION_CLEARED, {
        otherUserId,
      });
    }
    return true;
  }

  async toggleReaction(messageId, userId, emoji) {
    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    }
    if (message.isDeleted) {
      throw new AppError("Cannot react to a deleted message", 400);
    }
    const existingIndex = message.reactions.findIndex(
      (r) => r.user.toString() === userId.toString()
    );
    if (!emoji) {
      if (existingIndex !== -1) {
        message.reactions.splice(existingIndex, 1);
      }
    } else if (existingIndex !== -1) {
      message.reactions[existingIndex].emoji = emoji;
    } else {
      message.reactions.push({ user: userId, emoji });
    }
    await messageRepository.save(message);

    return await this._broadcastUpdate(
      message,
      userId,
      SOCKET_EVENTS.REACTION_UPDATED
    );
  }

  async togglePin(messageId, userId, isPinned) {
    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    }
    if (message.isDeleted) {
      throw new AppError("Cannot pin a deleted message", 400);
    }
    const isParticipant =
      message.sender.toString() === userId.toString() ||
      message.receiver.toString() === userId.toString();
    if (!isParticipant) {
      throw new AppError("You are not authorized to pin this message", 403);
    }

    message.isPinned = isPinned;
    message.pinnedBy = isPinned ? userId : null;
    await messageRepository.save(message);

    return await this._broadcastUpdate(
      message,
      userId,
      SOCKET_EVENTS.MESSAGE_PINNED
    );
  }

  async _broadcastUpdate(message, currentUserId, event) {
    const populated = await messageRepository.populate(message, MESSAGE_POPULATE);
    const senderDto = new MessageDto(populated, message.sender._id);
    const receiverDto = new MessageDto(populated, message.receiver._id);

    const senderSocket = getReceiverSocketId(message.sender._id);
    const receiverSocket = getReceiverSocketId(message.receiver._id);
    const isSameUser =
      message.sender._id.toString() === message.receiver._id.toString();

    if (senderSocket) {
      io.to(senderSocket).emit(event, senderDto);
    }
    if (receiverSocket && !isSameUser) {
      io.to(receiverSocket).emit(event, receiverDto);
    }

    return new MessageDto(populated, currentUserId);
  }

  async markConversationAsRead(currentUserId, otherUserId) {
    await messageRepository.markAsRead(otherUserId, currentUserId);
    const otherSocketId = getReceiverSocketId(otherUserId);
    if (otherSocketId) {
      io.to(otherSocketId).emit(SOCKET_EVENTS.MESSAGES_READ, {
        readerId: currentUserId,
        readAt: new Date(),
      });
    }
    return true;
  }

  async respondToGameProposal(messageId, userId, guessIndex) {
    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    }
    if (message.messageType !== MESSAGE_TYPES.GAME_TTAL) {
      throw new AppError("Message is not a game challenge", 400);
    }
    if (message.receiver.toString() !== userId.toString()) {
      throw new AppError("You are not authorized to respond to this challenge", 403);
    }
    if (message.gameInfo.status !== "pending") {
      throw new AppError("This game has already been played", 400);
    }

    message.gameInfo.guessIndex = guessIndex;
    message.gameInfo.status =
      guessIndex === message.gameInfo.lieIndex ? "correct" : "incorrect";
    await messageRepository.save(message);

    const populatedMessage = await messageRepository.populate(
      message,
      MESSAGE_POPULATE
    );

    const senderSocketId = getReceiverSocketId(message.sender._id);
    const receiverSocketId = getReceiverSocketId(message.receiver._id);

    const payload = (recipientId) => ({
      messageId: message._id,
      status: message.gameInfo.status,
      message: new MessageDto(populatedMessage, recipientId),
    });

    if (senderSocketId) {
      io.to(senderSocketId).emit(SOCKET_EVENTS.GAME_STATUS_UPDATE, payload(message.sender._id));
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(SOCKET_EVENTS.GAME_STATUS_UPDATE, payload(message.receiver._id));
    }

    return new MessageDto(populatedMessage, userId);
  }
}

export default new MessageService();
