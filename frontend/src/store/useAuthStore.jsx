import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,

  signup: async (signupData) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post("/auth/register", signupData);
      set({ authUser: response.data.user });
      toast.success("User created successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");
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
      if (response.status === 200) set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      set({ authUser: response.data.user });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ checkingAuth: false });
    }
  },
}));
