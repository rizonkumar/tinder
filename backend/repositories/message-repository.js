import Message from "../models/message-model.js";

class MessageRepository {
  async findById(id, populateOptions = []) {
    let query = Message.findById(id);
    if (populateOptions.length > 0) {
      query = query.populate(populateOptions);
    }
    return await query;
  }

  async create(messageData) {
    return await Message.create(messageData);
  }

  async findConversation(userIdA, userIdB, populateOptions = []) {
    let query = Message.find({
      $or: [
        { sender: userIdA, receiver: userIdB },
        { sender: userIdB, receiver: userIdA },
      ],
    }).sort({ createdAt: 1 });

    if (populateOptions.length > 0) {
      query = query.populate(populateOptions);
    }
    return await query;
  }

  async markAsRead(senderId, receiverId) {
    return await Message.updateMany(
      {
        sender: senderId,
        receiver: receiverId,
        read: false,
      },
      {
        read: true,
      }
    );
  }

  async countUnread(userId) {
    return await Message.countDocuments({
      receiver: userId,
      read: false,
    });
  }

  async searchConversation(userIdA, userIdB, queryStr, populateOptions = []) {
    let query = Message.find({
      $or: [
        { sender: userIdA, receiver: userIdB },
        { sender: userIdB, receiver: userIdA },
      ],
      messageType: "text",
      content: { $regex: queryStr, $options: "i" },
    }).sort({ createdAt: 1 });

    if (populateOptions.length > 0) {
      query = query.populate(populateOptions);
    }
    return await query;
  }

  async findRecent(userIdA, userIdB, limit = 5, populateOptions = []) {
    let query = Message.find({
      $or: [
        { sender: userIdA, receiver: userIdB },
        { sender: userIdB, receiver: userIdA },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    if (populateOptions.length > 0) {
      query = query.populate(populateOptions);
    }
    return await query;
  }

  async populate(messageDocument, populateOptions = []) {
    if (populateOptions.length > 0) {
      return await messageDocument.populate(populateOptions);
    }
    return messageDocument;
  }

  async save(messageDocument) {
    return await messageDocument.save();
  }
}

export default new MessageRepository();
