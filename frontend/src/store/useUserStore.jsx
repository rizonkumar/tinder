import { create } from "zustand";
import { axiosInstance } from "../utils/axios";

export const useUserStore = create((set) => ({
  loading: false,

  updateProfile: async (profileData) => {
    try {
      set({ loading: true });
      await axiosInstance.put("/users/update", profileData);
      toast.success("Profile updated successfully");
    } catch (error) {
    } finally {
      set({ loading: false });
    }
  },
}));
