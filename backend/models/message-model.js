import mongoose from "mongoose";
import { MESSAGE_TYPES } from "../constants/message-types.js";
import { DATE_STATUSES } from "../constants/date-statuses.js";

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

export default Message;
