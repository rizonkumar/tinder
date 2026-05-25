import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios";

export const useMatchStore = create((set) => ({
  matches: [],
  isLoadingMyMatches: false,
  isLoadingUserProfiles: false,
  userProfiles: [],
  swipeFeedback: null,

  getMyMatches: async () => {
    try {
      set({ isLoadingMyMatches: true });
      const response = await axiosInstance.get("/matches");
      set({ matches: response.data.data });
    } catch (error) {
      set({ matches: [] });
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoadingMyMatches: false });
    }
  },

  getUserProfiles: async () => {
    try {
      set({ isLoadingUserProfiles: true });
      const res = await axiosInstance.get("/matches/user-profiles");
      set({ userProfiles: res.data.data });
    } catch (error) {
      set({ userProfiles: [] });
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoadingUserProfiles: false });
    }
  },

  swipeLeft: async (user) => {
    try {
      set((state) => ({
        userProfiles: state.userProfiles.filter((p) => p._id !== user._id),
      }));
      const response = await axiosInstance.post(`/matches/swipe-left/${user._id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to swipe left");
    }
  },

  swipeRight: async (user) => {
    try {
      set((state) => ({
        userProfiles: state.userProfiles.filter((p) => p._id !== user._id),
      }));
      const response = await axiosInstance.post(`/matches/swipe-right/${user._id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to swipe right");
    }
  },
}));
