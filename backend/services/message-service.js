import messageRepository from "../repositories/message-repository.js";
import AppError from "../utils/appError.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import cloudinary from "../config/cloudinary.js";
import { SOCKET_EVENTS } from "../constants/socket-events.js";
import { MESSAGE_TYPES } from "../constants/message-types.js";
import { DATE_STATUSES } from "../constants/date-statuses.js";
import MessageDto from "../dtos/message-dto.js";

class MessageService {
  async sendMessage(senderId, receiverId, content, messageType = MESSAGE_TYPES.TEXT, mediaUrl = "", dateInfo = null, gameInfo = null) {
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
      } else if (messageType === MESSAGE_TYPES.VOICE_NOTE) {
        messageContent = "Sent a voice note 🎤";
      } else if (messageType === MESSAGE_TYPES.DATE_PROPOSAL) {
        messageContent = `Proposed a date: ${dateInfo?.activity || "activity"}`;
      } else if (messageType === MESSAGE_TYPES.GAME_TTAL) {
        messageContent = "Challenged you to Two Truths & a Lie! 🎮";
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
      gameInfo,
    });

    const populatedMessage = await messageRepository.populate(newMessage, [
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);

    const senderDto = new MessageDto(populatedMessage, senderId);
    const receiverDto = new MessageDto(populatedMessage, receiverId);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(SOCKET_EVENTS.NEW_MESSAGE, receiverDto);
    }

    return senderDto;
  }

  async getConversation(currentUserId, otherUserId) {
    const messages = await messageRepository.findConversation(currentUserId, otherUserId, [
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);

    await messageRepository.markAsRead(otherUserId, currentUserId);

    const otherSocketId = getReceiverSocketId(otherUserId);
    if (otherSocketId) {
      io.to(otherSocketId).emit(SOCKET_EVENTS.MESSAGES_READ, {
        readerId: currentUserId,
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
    const messages = await messageRepository.findConfirmedDates(userId, [
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);

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
      [
        { path: "sender", select: "name image" },
        { path: "receiver", select: "name image" },
      ]
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

    const populated = await messageRepository.populate(message, [
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);
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
      await messageRepository.save(message);

      const populated = await messageRepository.populate(message, [
        { path: "sender", select: "name image" },
        { path: "receiver", select: "name image" },
      ]);
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
      const populated = await messageRepository.populate(message, [
        { path: "sender", select: "name image" },
        { path: "receiver", select: "name image" },
      ]);
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
    } else {
      if (existingIndex !== -1) {
        message.reactions[existingIndex].emoji = emoji;
      } else {
        message.reactions.push({ user: userId, emoji });
      }
    }
    await messageRepository.save(message);

    const populated = await messageRepository.populate(message, [
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);
    const senderDto = new MessageDto(populated, message.sender._id);
    const receiverDto = new MessageDto(populated, message.receiver._id);

    const senderSocket = getReceiverSocketId(message.sender._id);
    const receiverSocket = getReceiverSocketId(message.receiver._id);

    if (senderSocket) {
      io.to(senderSocket).emit(SOCKET_EVENTS.REACTION_UPDATED, senderDto);
    }
    if (receiverSocket && message.sender._id.toString() !== message.receiver._id.toString()) {
      io.to(receiverSocket).emit(SOCKET_EVENTS.REACTION_UPDATED, receiverDto);
    }
    return new MessageDto(populated, userId);
  }

  async markConversationAsRead(currentUserId, otherUserId) {
    await messageRepository.markAsRead(otherUserId, currentUserId);
    const otherSocketId = getReceiverSocketId(otherUserId);
    if (otherSocketId) {
      io.to(otherSocketId).emit(SOCKET_EVENTS.MESSAGES_READ, {
        readerId: currentUserId,
      });
    }
    return true;
  }

  async respondToGameProposal(messageId, userId, guessIndex) {
    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    }
    if (message.messageType !== "game_ttal") {
      throw new AppError("Message is not a game challenge", 400);
    }
    if (message.receiver.toString() !== userId.toString()) {
      throw new AppError("You are not authorized to respond to this challenge", 403);
    }
    if (message.gameInfo.status !== "pending") {
      throw new AppError("This game has already been played", 400);
    }

    message.gameInfo.guessIndex = guessIndex;
    message.gameInfo.status = (guessIndex === message.gameInfo.lieIndex) ? "correct" : "incorrect";
    await messageRepository.save(message);

    const populatedMessage = await messageRepository.populate(message, [
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);

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
