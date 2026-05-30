const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

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

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("callUser", ({ targetId, offer, callType, callerInfo }) => {
    const receiverSocketId = getReceiverSocketId(targetId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incomingCall", {
        callerId: userId,
        offer,
        callType,
        callerInfo,
      });
    }
  });

  socket.on("acceptCall", ({ targetId, answer }) => {
    const callerSocketId = getReceiverSocketId(targetId);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", { answer });
    }
  });

  socket.on("sendIceCandidate", ({ targetId, candidate }) => {
    const peerSocketId = getReceiverSocketId(targetId);
    if (peerSocketId) {
      io.to(peerSocketId).emit("receiveIceCandidate", { candidate });
    }
  });

  socket.on("disconnectCall", ({ targetId }) => {
    const peerSocketId = getReceiverSocketId(targetId);
    if (peerSocketId) {
      io.to(peerSocketId).emit("callEnded");
    }
  });

  socket.on("typing", ({ targetId, isTyping }) => {
    const receiverSocketId = getReceiverSocketId(targetId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", {
        senderId: userId,
        isTyping,
      });
    }
  });

  socket.on("callReaction", ({ targetId, reaction }) => {
    const receiverSocketId = getReceiverSocketId(targetId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callReaction", {
        senderId: userId,
        reaction,
      });
    }
  });

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, server, io, getReceiverSocketId };
