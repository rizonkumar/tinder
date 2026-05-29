import { create } from "zustand";
import { axiosInstance } from "../services/api";
import showToast from "../components/common/Toast";
import { socketService } from "../services/socket";

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
      showToast.success("User created successfully");
      get().connectSocket();
    } catch (error) {
      console.error(error);
      showToast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  login: async (loginData) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post("/auth/login", loginData);
      set({ authUser: response.data.data.user });
      showToast.success("Logged in successfully");
      get().connectSocket();
      return true;
    } catch (error) {
      console.error(error);
      showToast.error(error.response?.data?.message || "Something went wrong");
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
      showToast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      showToast.error(error.response?.data?.message || "Something went wrong");
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
      console.error(error);
      set({ authUser: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket) return;

    const newSocket = socketService.connect(authUser._id);
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socketService.disconnect();
      set({ socket: null });
    }
  },
}));
