import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set, get) => ({
  messages: [],
  activeChatUser: null,
  isLoadingMessages: false,
  unreadCount: 0,
  icebreakers: [],
  isLoadingIcebreakers: false,

  setActiveChatUser: (user) => set({ activeChatUser: user }),

  getMessages: async (userId) => {
    try {
      set({ isLoadingMessages: true });
      const response = await axiosInstance.get(`/messages/conversation/${userId}`);
      set({ messages: response.data.data.conversation });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (content, messageType = "text", mediaUrl = "") => {
    const { activeChatUser, messages } = get();
    if (!activeChatUser) return;
    try {
      const response = await axiosInstance.post("/messages/send", {
        receiverId: activeChatUser._id,
        content,
        messageType,
        mediaUrl,
      });
      const newMessage = response.data.data;
      set({ messages: [...messages, newMessage] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  getIcebreakers: async (userId) => {
    try {
      set({ isLoadingIcebreakers: true, icebreakers: [] });
      const response = await axiosInstance.post(`/messages/icebreakers/${userId}`);
      set({ icebreakers: response.data.data });
    } catch {
      toast.error("Failed to generate icebreakers");
    } finally {
      set({ isLoadingIcebreakers: false });
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
      } else {
        toast(`New message from ${newMessage.sender.name}! 💬`, {
          icon: "💬",
          duration: 3000,
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
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
}));
