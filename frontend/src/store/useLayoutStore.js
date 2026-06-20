import { create } from "zustand";

const getInitialOpen = () => {
  if (typeof window === "undefined") return true;
  return window.innerWidth >= 1024;
};

export const useLayoutStore = create((set) => ({
  isSidebarOpen: getInitialOpen(),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (value) => set({ isSidebarOpen: value }),
}));
