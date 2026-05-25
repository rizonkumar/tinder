import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,
  socket: null,
  onlineUsers: [],

  signup: async (signupData) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post("/auth/register", signupData);
      set({ authUser: response.data.data.user });
      toast.success("User created successfully");
      get().connectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  login: async (loginData) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post("/auth/login", loginData);
      set({ authUser: response.data.data.user });
      toast.success("Logged in successfully");
      get().connectSocket();
      return true;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post("/auth/logout");
      if (response.status === 200) {
        get().disconnectSocket();
        set({ authUser: null });
      }
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      set({ authUser: response.data.data.user });
      get().connectSocket();
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket) return;

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
