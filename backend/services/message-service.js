const Message = require("../models/message-model");
const AppError = require("../utils/appError");

class MessageService {
  async sendMessage(senderId, receiverId, content) {
    if (!content.trim()) {
      throw new AppError("Message content cannot be empty", 400);
    }
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: content.trim(),
    });

    // Populate sender and receiver details
    const populatedMessage = await newMessage.populate([
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);

    // TODO: Send the message in real time using socket.io

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
      .sort({ createdAt: 1 }); // Sort by timestamp ascending

    //   Mark unread messages as read
    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        read: false,
      },
      {
        read: true,
      }
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
