import { create } from "zustand";
import { axiosInstance } from "../services/api";
import showToast from "../components/common/Toast";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set, get) => ({
  messages: [],
  activeChatUser: null,
  isLoadingMessages: false,
  unreadCount: 0,
  icebreakers: [],
  isLoadingIcebreakers: false,
  smartReplies: [],
  isLoadingSmartReplies: false,
  isTypingUser: false,
  editingMessage: null,
  replyingTo: null,

  setActiveChatUser: (user) =>
    set({
      activeChatUser: user,
      isTypingUser: false,
      editingMessage: null,
      replyingTo: null,
    }),

  setEditingMessage: (message) =>
    set({ editingMessage: message, replyingTo: null }),

  setReplyingTo: (message) =>
    set({ replyingTo: message, editingMessage: null }),

  getMessages: async (userId) => {
    try {
      set({ isLoadingMessages: true });
      const response = await axiosInstance.get(
        `/messages/conversation/${userId}`,
      );
      set({ messages: response.data.data.conversation });
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (content, messageType = "text", mediaUrl = "", dateInfo = null, gameInfo = null) => {
    const { activeChatUser, messages, replyingTo } = get();
    if (!activeChatUser) return;
    try {
      const response = await axiosInstance.post("/messages/send", {
        receiverId: activeChatUser._id,
        content,
        messageType,
        mediaUrl,
        dateInfo,
        gameInfo,
        replyTo: replyingTo?._id || null,
      });
      const newMessage = response.data.data;
      set({ messages: [...messages, newMessage], replyingTo: null });
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  respondToDateProposal: async (messageId, status) => {
    try {
      const response = await axiosInstance.post("/messages/date/respond", {
        messageId,
        status,
      });
      const updatedMessage = response.data.data;
      
      const { messages } = get();
      const newMessages = messages.map((m) =>
        m._id === messageId ? updatedMessage : m
      );
      set({ messages: newMessages });
      showToast.success(`Date proposal ${status}!`);
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to respond to date proposal");
    }
  },

  respondToGameProposal: async (messageId, guessIndex) => {
    try {
      const response = await axiosInstance.post("/messages/game/respond", {
        messageId,
        guessIndex,
      });
      const updatedMessage = response.data.data;

      const { messages } = get();
      const newMessages = messages.map((m) =>
        m._id === messageId ? updatedMessage : m
      );
      set({ messages: newMessages });

      if (updatedMessage.gameInfo.status === "correct") {
        showToast.success("Correct! That was indeed the lie! 🎉");
      } else {
        showToast.error("Wrong! You fell for it! 😜");
      }
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to submit guess");
    }
  },

  getSmartReplies: async (userId) => {
    try {
      set({ isLoadingSmartReplies: true, smartReplies: [] });
      const response = await axiosInstance.post(`/messages/smart-replies/${userId}`);
      set({ smartReplies: response.data.data });
    } catch (error) {
      console.error("Failed to generate smart replies:", error);
    } finally {
      set({ isLoadingSmartReplies: false });
    }
  },

  getIcebreakers: async (userId) => {
    try {
      set({ isLoadingIcebreakers: true, icebreakers: [] });
      const response = await axiosInstance.post(
        `/messages/icebreakers/${userId}`,
      );
      set({ icebreakers: response.data.data });
    } catch {
      showToast.error("Failed to generate icebreakers");
    } finally {
      set({ isLoadingIcebreakers: false });
    }
  },

  sendTypingStatus: (isTyping) => {
    const socket = useAuthStore.getState().socket;
    const { activeChatUser } = get();
    if (socket && activeChatUser) {
      socket.emit("typing", { targetId: activeChatUser._id, isTyping });
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const { activeChatUser, messages } = get();
      if (activeChatUser && newMessage.sender._id === activeChatUser._id) {
        set({ messages: [...messages, newMessage] });
        get().markConversationAsRead(activeChatUser._id);
      } else {
        showToast.match(`New message from ${newMessage.sender.name}!`);
      }
    });

    socket.off("userTyping");
    socket.on("userTyping", ({ senderId, isTyping }) => {
      const { activeChatUser } = get();
      if (activeChatUser && senderId === activeChatUser._id) {
        set({ isTypingUser: isTyping });
      }
    });

    socket.off("dateStatusUpdate");
    socket.on("dateStatusUpdate", ({ messageId, status, message }) => {
      const { activeChatUser, messages } = get();
      const newMessages = messages.map((m) =>
        m._id === messageId ? message : m
      );
      set({ messages: newMessages });

      const authUser = useAuthStore.getState().authUser;
      if (!authUser) return;

      const senderId = message.sender && message.sender._id
        ? message.sender._id.toString()
        : message.sender.toString();

      const isCreator = senderId === authUser._id.toString();
      const isRecipientCurrentChat = activeChatUser && message.receiver._id.toString() === activeChatUser._id.toString();

      if (status === "accepted" && isCreator && isRecipientCurrentChat) {
        showToast.match(`Date Proposal Confirmed with ${activeChatUser.name}!`);
      }
    });

    socket.off("gameStatusUpdate");
    socket.on("gameStatusUpdate", ({ messageId, status, message }) => {
      const { activeChatUser, messages } = get();
      const newMessages = messages.map((m) =>
        m._id === messageId ? message : m
      );
      set({ messages: newMessages });

      const authUser = useAuthStore.getState().authUser;
      if (!authUser) return;

      const senderId = message.sender && message.sender._id
        ? message.sender._id.toString()
        : message.sender.toString();
      const receiverId = message.receiver && message.receiver._id
        ? message.receiver._id.toString()
        : message.receiver.toString();

      const isChallenger = senderId === authUser._id.toString();
      const isGuesserCurrentChat = activeChatUser && receiverId === activeChatUser._id.toString();

      if (isChallenger && isGuesserCurrentChat) {
        if (status === "correct") {
          showToast.match(`${activeChatUser.name} guessed correctly! 🎉`);
        } else {
          showToast.match(`${activeChatUser.name} guessed incorrectly! 😜`);
        }
      }
    });

    socket.off("messageEdited");
    socket.on("messageEdited", (updatedMessage) => {
      const { messages } = get();
      set({
        messages: messages.map((m) =>
          m._id === updatedMessage._id ? updatedMessage : m
        ),
      });
    });

    socket.off("messageDeleted");
    socket.on("messageDeleted", (updatedMessage) => {
      const { messages } = get();
      set({
        messages: messages.map((m) =>
          m._id === updatedMessage._id ? updatedMessage : m
        ),
      });
    });

    socket.off("reactionUpdated");
    socket.on("reactionUpdated", (updatedMessage) => {
      const { messages } = get();
      set({
        messages: messages.map((m) =>
          m._id === updatedMessage._id ? updatedMessage : m
        ),
      });
    });

    socket.off("messagePinned");
    socket.on("messagePinned", (updatedMessage) => {
      const { messages } = get();
      set({
        messages: messages.map((m) =>
          m._id === updatedMessage._id ? updatedMessage : m
        ),
      });
    });

    socket.off("conversationCleared");
    socket.on("conversationCleared", ({ otherUserId }) => {
      const { activeChatUser } = get();
      if (activeChatUser && activeChatUser._id === otherUserId) {
        set({ messages: [] });
      }
    });

    socket.off("messagesRead");
    socket.on("messagesRead", ({ readerId }) => {
      const { activeChatUser, messages } = get();
      if (activeChatUser && activeChatUser._id === readerId) {
        set({
          messages: messages.map((m) =>
            m.read ? m : { ...m, read: true }
          ),
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("userTyping");
      socket.off("dateStatusUpdate");
      socket.off("gameStatusUpdate");
      socket.off("messageEdited");
      socket.off("messageDeleted");
      socket.off("reactionUpdated");
      socket.off("messagePinned");
      socket.off("conversationCleared");
      socket.off("messagesRead");
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await axiosInstance.get("/messages/unread-count");
      set({ unreadCount: response.data.data.unreadCount });
    } catch (error) {
      console.log("Error getting unread count:", error);
    }
  },

  searchMessages: async (userId, query) => {
    try {
      const response = await axiosInstance.get(
        `/messages/search/${userId}?query=${encodeURIComponent(query)}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to search messages in store:", error);
      return [];
    }
  },

  editMessage: async (messageId, content) => {
    try {
      const response = await axiosInstance.patch(`/messages/${messageId}`, {
        content,
      });
      const updatedMessage = response.data.data;
      const { messages } = get();
      set({
        messages: messages.map((m) =>
          m._id === messageId ? updatedMessage : m
        ),
      });
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to edit message");
    }
  },

  deleteMessage: async (messageId, deleteForEveryone = false) => {
    try {
      const response = await axiosInstance.delete(`/messages/${messageId}`, {
        data: { deleteForEveryone },
      });
      const updatedMessage = response.data.data;
      const { messages } = get();
      if (deleteForEveryone) {
        set({
          messages: messages.map((m) =>
            m._id === messageId ? updatedMessage : m
          ),
        });
      } else {
        set({
          messages: messages.filter((m) => m._id !== messageId),
        });
      }
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  clearConversation: async (userId) => {
    try {
      await axiosInstance.delete(`/messages/conversation/${userId}`);
      set({ messages: [] });
      showToast.success("Conversation cleared");
    } catch (error) {
      showToast.error(
        error.response?.data?.message || "Failed to clear conversation"
      );
    }
  },

  toggleReaction: async (messageId, emoji) => {
    try {
      const response = await axiosInstance.post(
        `/messages/react/${messageId}`,
        { emoji }
      );
      const updatedMessage = response.data.data;
      const { messages } = get();
      set({
        messages: messages.map((m) =>
          m._id === messageId ? updatedMessage : m
        ),
      });
    } catch (error) {
      showToast.error(
        error.response?.data?.message || "Failed to update reaction"
      );
    }
  },

  togglePin: async (messageId, isPinned) => {
    try {
      const response = await axiosInstance.patch(`/messages/${messageId}/pin`, {
        isPinned,
      });
      const updatedMessage = response.data.data;
      const { messages } = get();
      set({
        messages: messages.map((m) =>
          m._id === messageId ? updatedMessage : m
        ),
      });
      showToast.success(isPinned ? "Message pinned" : "Message unpinned");
    } catch (error) {
      showToast.error(
        error.response?.data?.message || "Failed to update pinned message"
      );
    }
  },

  markConversationAsRead: async (userId) => {
    try {
      const response = await axiosInstance.post(`/messages/read/${userId}`);
      set({ unreadCount: response.data.data.unreadCount });
    } catch (error) {
      console.error("Failed to mark conversation as read:", error);
    }
  },
}));
