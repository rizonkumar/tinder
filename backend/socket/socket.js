import { Server } from "socket.io";
import http from "http";
import express from "express";
import { SOCKET_EVENTS } from "../constants/socket-events.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit(SOCKET_EVENTS.GET_ONLINE_USERS, Object.keys(userSocketMap));

  socket.on(SOCKET_EVENTS.CALL_USER, ({ targetId, offer, callType, callerInfo }) => {
    const receiverSocketId = getReceiverSocketId(targetId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(SOCKET_EVENTS.INCOMING_CALL, {
        callerId: userId,
        offer,
        callType,
        callerInfo,
      });
    }
  });

  socket.on(SOCKET_EVENTS.ACCEPT_CALL, ({ targetId, answer }) => {
    const callerSocketId = getReceiverSocketId(targetId);
    if (callerSocketId) {
      io.to(callerSocketId).emit(SOCKET_EVENTS.CALL_ACCEPTED, { answer });
    }
  });

  socket.on(SOCKET_EVENTS.SEND_ICE_CANDIDATE, ({ targetId, candidate }) => {
    const peerSocketId = getReceiverSocketId(targetId);
    if (peerSocketId) {
      io.to(peerSocketId).emit(SOCKET_EVENTS.RECEIVE_ICE_CANDIDATE, { candidate });
    }
  });

  socket.on(SOCKET_EVENTS.DISCONNECT_CALL, ({ targetId }) => {
    const peerSocketId = getReceiverSocketId(targetId);
    if (peerSocketId) {
      io.to(peerSocketId).emit(SOCKET_EVENTS.CALL_ENDED);
    }
  });

  socket.on(SOCKET_EVENTS.TYPING, ({ targetId, isTyping }) => {
    const receiverSocketId = getReceiverSocketId(targetId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(SOCKET_EVENTS.USER_TYPING, {
        senderId: userId,
        isTyping,
      });
    }
  });

  socket.on(SOCKET_EVENTS.CALL_REACTION, ({ targetId, reaction }) => {
    const receiverSocketId = getReceiverSocketId(targetId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(SOCKET_EVENTS.CALL_REACTION, {
        senderId: userId,
        reaction,
      });
    }
  });

  socket.on(SOCKET_EVENTS.DATE_PLAN_JOIN, ({ datePlanId }) => {
    socket.join(`dateplan_${datePlanId}`);
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit(SOCKET_EVENTS.GET_ONLINE_USERS, Object.keys(userSocketMap));
  });
});

export { app, server, io, getReceiverSocketId };
