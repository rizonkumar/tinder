const mongoose = require("mongoose");
const { MESSAGE_TYPES } = require("../constants/message-types");
const { DATE_STATUSES } = require("../constants/date-statuses");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: Object.values(MESSAGE_TYPES),
      default: MESSAGE_TYPES.TEXT,
    },
    mediaUrl: {
      type: String,
      default: "",
    },
    read: {
      type: Boolean,
      default: false,
    },
    dateInfo: {
      date: String,
      time: String,
      location: String,
      activity: String,
      status: {
        type: String,
        enum: Object.values(DATE_STATUSES),
        default: DATE_STATUSES.PENDING,
      },
    },
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
