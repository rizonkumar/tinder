class MessageDto {
  constructor(message, currentUserId = null) {
    if (!message) return;
    const msgObj = typeof message.toObject === "function" ? message.toObject() : message;

    this.id = msgObj._id.toString();
    this._id = this.id;
    this.sender = this._mapUserRef(msgObj.sender);
    this.receiver = this._mapUserRef(msgObj.receiver);
    this.isDeleted = !!msgObj.isDeleted;
    this.isEdited = !!msgObj.isEdited;
    this.content = this.isDeleted ? "This message was deleted" : msgObj.content;
    this.messageType = msgObj.messageType;
    this.mediaUrl = this.isDeleted ? "" : (msgObj.mediaUrl || "");
    this.read = !!msgObj.read;
    this.reactions = msgObj.reactions
      ? msgObj.reactions.map((r) => ({
          userId: r.user.toString(),
          emoji: r.emoji,
        }))
      : [];
    this.deletedFor = msgObj.deletedFor
      ? msgObj.deletedFor.map((d) => d.toString())
      : [];

    if (msgObj.dateInfo) {
      this.dateInfo = {
        date: msgObj.dateInfo.date,
        time: msgObj.dateInfo.time,
        location: msgObj.dateInfo.location,
        activity: msgObj.dateInfo.activity,
        status: msgObj.dateInfo.status,
      };
    } else {
      this.dateInfo = null;
    }

    if (msgObj.gameInfo) {
      const senderId = msgObj.sender && msgObj.sender._id
        ? msgObj.sender._id.toString()
        : (msgObj.sender ? msgObj.sender.toString() : "");
      const isSender = senderId === currentUserId?.toString();
      const isResolved = msgObj.gameInfo.status !== "pending";

      this.gameInfo = {
        statements: msgObj.gameInfo.statements,
        guessIndex: msgObj.gameInfo.guessIndex !== undefined && msgObj.gameInfo.guessIndex !== null ? msgObj.gameInfo.guessIndex : null,
        status: msgObj.gameInfo.status,
        lieIndex: (isSender || isResolved) ? msgObj.gameInfo.lieIndex : null,
      };
    } else {
      this.gameInfo = null;
    }

    this.createdAt = msgObj.createdAt;
    this.updatedAt = msgObj.updatedAt;
  }

  _mapUserRef(ref) {
    if (!ref) return null;
    if (typeof ref === "object" && ref._id) {
      return {
        id: ref._id.toString(),
        _id: ref._id.toString(),
        name: ref.name,
        image: ref.image || "",
      };
    }
    return ref.toString();
  }
}

export default MessageDto;
