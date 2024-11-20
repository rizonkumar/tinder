import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
  loading: false,

  updateProfile: async (profileData) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.put("/users/update", profileData);
      toast.success("Profile updated successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
