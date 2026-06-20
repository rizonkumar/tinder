import Message from "../models/message-model.js";
import { MESSAGE_TYPES } from "../constants/message-types.js";
import { DATE_STATUSES } from "../constants/date-statuses.js";

class MessageRepository {
  async findConfirmedDates(userId, populateOptions = []) {
    let query = Message.find({
      messageType: MESSAGE_TYPES.DATE_PROPOSAL,
      "dateInfo.status": DATE_STATUSES.ACCEPTED,
      $or: [{ sender: userId }, { receiver: userId }],
      deletedFor: { $ne: userId },
    }).sort({ createdAt: -1 });

    if (populateOptions.length > 0) {
      query = query.populate(populateOptions);
    }
    return await query;
  }

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
      deletedFor: { $ne: userIdA },
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
      deletedFor: { $ne: userIdA },
      messageType: "text",
      content: { $regex: queryStr, $options: "i" },
    }).sort({ createdAt: 1 });

    if (populateOptions.length > 0) {
      query = query.populate(populateOptions);
    }
    return await query;
  }

  async clearConversation(userId, otherUserId) {
    return await Message.updateMany(
      {
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      },
      {
        $addToSet: { deletedFor: userId },
      }
    );
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
