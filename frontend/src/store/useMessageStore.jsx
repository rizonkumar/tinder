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

  setActiveChatUser: (user) => set({ activeChatUser: user, isTypingUser: false }),

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

  sendMessage: async (content, messageType = "text", mediaUrl = "", dateInfo = null) => {
    const { activeChatUser, messages } = get();
    if (!activeChatUser) return;
    try {
      const response = await axiosInstance.post("/messages/send", {
        receiverId: activeChatUser._id,
        content,
        messageType,
        mediaUrl,
        dateInfo,
      });
      const newMessage = response.data.data;
      set({ messages: [...messages, newMessage] });
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

      // If active chat and date accepted, we can celebrate!
      if (status === "accepted" && activeChatUser && message.sender._id === activeChatUser._id) {
        showToast.match(`Date Proposal Confirmed with ${activeChatUser.name}!`);
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
      socket.off("messageEdited");
      socket.off("messageDeleted");
      socket.off("reactionUpdated");
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

  markConversationAsRead: async (userId) => {
    try {
      const response = await axiosInstance.post(`/messages/read/${userId}`);
      set({ unreadCount: response.data.data.unreadCount });
    } catch (error) {
      console.error("Failed to mark conversation as read:", error);
    }
  },
}));
