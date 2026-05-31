class MessageDto {
  constructor(message) {
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
