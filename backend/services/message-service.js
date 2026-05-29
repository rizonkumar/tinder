const Message = require("../models/message-model");
const AppError = require("../utils/appError");
const { getReceiverSocketId, io } = require("../socket/socket");

class MessageService {
  async sendMessage(senderId, receiverId, content, messageType = "text", mediaUrl = "") {
    if (messageType === "text" && (!content || !content.trim())) {
      throw new AppError("Message content cannot be empty for text messages", 400);
    }

    const messageContent = content ? content.trim() : (messageType === "image" ? "Sent an image" : "Sent a voice note");

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: messageContent,
      messageType,
      mediaUrl,
    });

    const populatedMessage = await newMessage.populate([
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return populatedMessage;
  }

  async getConversation(currentUserId, otherUserId) {
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .populate([
        { path: "sender", select: "name image" },
        { path: "receiver", select: "name image" },
      ])
      .sort({ createdAt: 1 });

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        read: false,
      },
      {
        read: true,
      },
    );
    return messages;
  }

  async getUnreadCount(userId) {
    const count = await Message.countDocuments({
      receiver: userId,
      read: false,
    });
    return count;
  }
}

module.exports = new MessageService();
