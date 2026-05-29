import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create((set) => ({
  loading: false,
  swipeStats: null,
  whoLikedMe: [],
  isLoadingWhoLikedMe: false,
  isLoadingStats: false,

  updateProfile: async (profileData) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.put("/users/update", profileData);
      const updatedUser = response.data.data;

      useAuthStore.setState({ authUser: updatedUser });

      toast.success("Profile updated successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  toggleIncognito: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.put("/users/toggle-incognito");
      const updatedUser = response.data.data;
      useAuthStore.setState({ authUser: updatedUser });
      toast.success(
        updatedUser.incognitoMode
          ? "Incognito Mode activated! 🕵️"
          : "Incognito Mode deactivated!"
      );
      return updatedUser;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle incognito mode");
    } finally {
      set({ loading: false });
    }
  },

  toggleGold: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.put("/users/toggle-gold");
      const updatedUser = response.data.data;
      useAuthStore.setState({ authUser: updatedUser });
      toast.success(
        updatedUser.isGold
          ? "Welcome to Tinder Gold! 💛"
          : "Gold membership canceled!"
      );
      return updatedUser;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle gold membership");
    } finally {
      set({ loading: false });
    }
  },

  getSwipeStats: async () => {
    try {
      set({ isLoadingStats: true });
      const response = await axiosInstance.get("/users/stats");
      set({ swipeStats: response.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch stats");
    } finally {
      set({ isLoadingStats: false });
    }
  },

  getWhoLikedMe: async () => {
    try {
      set({ isLoadingWhoLikedMe: true });
      const response = await axiosInstance.get("/matches/who-liked-me");
      set({ whoLikedMe: response.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch 'Who Liked You' feed");
    } finally {
      set({ isLoadingWhoLikedMe: false });
    }
  },
}));
