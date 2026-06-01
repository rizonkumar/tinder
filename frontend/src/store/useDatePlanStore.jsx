import { create } from "zustand";
import { axiosInstance } from "../services/api";
import showToast from "../components/common/Toast";

export const useDatePlanStore = create((set) => ({
  activeDatePlan: null,
  upcomingDates: [],
  isLoadingPlan: false,
  isLoadingUpcoming: false,

  getActivePlan: async (matchUserId) => {
    try {
      set({ isLoadingPlan: true });
      const response = await axiosInstance.get(`/dates/match/${matchUserId}`);
      set({ activeDatePlan: response.data.data });
      return response.data.data;
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to fetch date plan");
      return null;
    } finally {
      set({ isLoadingPlan: false });
    }
  },

  voteCategory: async (id, category) => {
    try {
      const response = await axiosInstance.post(`/dates/${id}/vote-category`, { category });
      set({ activeDatePlan: response.data.data });
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to vote category");
    }
  },

  proposeVenue: async (id, title, location) => {
    try {
      const response = await axiosInstance.post(`/dates/${id}/propose-venue`, { title, location });
      set({ activeDatePlan: response.data.data });
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to propose venue");
    }
  },

  voteVenue: async (id, venueId) => {
    try {
      const response = await axiosInstance.post(`/dates/${id}/vote-venue`, { venueId });
      set({ activeDatePlan: response.data.data });
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to vote venue");
    }
  },

  proposeDateTime: async (id, date, time) => {
    try {
      const response = await axiosInstance.post(`/dates/${id}/propose-datetime`, { date, time });
      set({ activeDatePlan: response.data.data });
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to propose date-time");
    }
  },

  voteDateTime: async (id, dateTimeId) => {
    try {
      const response = await axiosInstance.post(`/dates/${id}/vote-datetime`, { dateTimeId });
      set({ activeDatePlan: response.data.data });
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to vote date-time");
    }
  },

  finalizePlan: async (id, venueId, dateTimeId) => {
    try {
      const response = await axiosInstance.post(`/dates/${id}/finalize`, { venueId, dateTimeId });
      set({ activeDatePlan: response.data.data });
      showToast.success("Date plan finalized successfully!");
      return response.data.data;
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to finalize date plan");
      return null;
    }
  },

  getUpcomingDates: async () => {
    try {
      set({ isLoadingUpcoming: true });
      const response = await axiosInstance.get("/dates/upcoming");
      set({ upcomingDates: response.data.data });
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to fetch upcoming dates");
    } finally {
      set({ isLoadingUpcoming: false });
    }
  },

  subscribeToDatePlan: (socket, datePlanId) => {
    if (!socket || !datePlanId) return;
    socket.emit("datePlanJoin", { datePlanId });
    socket.off("datePlanUpdated");
    socket.on("datePlanUpdated", ({ datePlan }) => {
      set({ activeDatePlan: datePlan });
    });
  },

  unsubscribeFromDatePlan: (socket) => {
    if (!socket) return;
    socket.off("datePlanUpdated");
  },
}));
