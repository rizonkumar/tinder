const Message = require("../models/message-model");
const AppError = require("../utils/appError");
const { getReceiverSocketId, io } = require("../socket/socket");
const cloudinary = require("../config/cloudinary");

class MessageService {
  async sendMessage(senderId, receiverId, content, messageType = "text", mediaUrl = "", dateInfo = null) {
    if (messageType === "text" && (!content || !content.trim())) {
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
      if (messageType === "image") messageContent = "Sent an image 📸";
      else if (messageType === "date_proposal") messageContent = `Proposed a date: ${dateInfo?.activity || "activity"}`;
      else messageContent = "Sent an attachment";
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: messageContent,
      messageType,
      mediaUrl: finalMediaUrl,
      dateInfo,
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

  async respondToDateProposal(messageId, userId, status) {
    if (!["accepted", "declined"].includes(status)) {
      throw new AppError("Invalid status. Must be accepted or declined", 400);
    }

    const message = await Message.findById(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    }

    if (message.messageType !== "date_proposal") {
      throw new AppError("Message is not a date proposal", 400);
    }

    // Verify authorized user is responding (the receiver)
    if (message.receiver.toString() !== userId.toString()) {
      throw new AppError("You are not authorized to respond to this proposal", 403);
    }

    message.dateInfo.status = status;
    await message.save();

    const populatedMessage = await message.populate([
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
    ]);

    const senderSocketId = getReceiverSocketId(message.sender._id);
    const receiverSocketId = getReceiverSocketId(message.receiver._id);

    const payload = {
      messageId: message._id,
      status,
      message: populatedMessage,
    };

    if (senderSocketId) {
      io.to(senderSocketId).emit("dateStatusUpdate", payload);
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("dateStatusUpdate", payload);
    }

    return populatedMessage;
  }

  async searchMessages(currentUserId, otherUserId, query) {
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
      messageType: "text",
      content: { $regex: query, $options: "i" },
    })
      .populate([
        { path: "sender", select: "name image" },
        { path: "receiver", select: "name image" },
      ])
      .sort({ createdAt: 1 });

    return messages;
  }
}

module.exports = new MessageService();
