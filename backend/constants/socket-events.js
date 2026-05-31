export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  GET_ONLINE_USERS: "getOnlineUsers",

  TYPING: "typing",
  USER_TYPING: "userTyping",
  NEW_MESSAGE: "newMessage",
  MESSAGE_EDITED: "messageEdited",
  MESSAGE_DELETED: "messageDeleted",
  REACTION_UPDATED: "reactionUpdated",
  CONVERSATION_CLEARED: "conversationCleared",
  MESSAGES_READ: "messagesRead",

  MATCH_CELEBRATION: "matchCelebration",
  SUPER_LIKE_RECEIVED: "superLikeReceived",
  DATE_STATUS_UPDATE: "dateStatusUpdate",

  CALL_USER: "callUser",
  INCOMING_CALL: "incomingCall",
  ACCEPT_CALL: "acceptCall",
  CALL_ACCEPTED: "callAccepted",
  SEND_ICE_CANDIDATE: "sendIceCandidate",
  RECEIVE_ICE_CANDIDATE: "receiveIceCandidate",
  DISCONNECT_CALL: "disconnectCall",
  CALL_ENDED: "callEnded",
  CALL_REACTION: "callReaction",
};
