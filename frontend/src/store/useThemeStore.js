import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem("color-scheme") || 
         (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),

  initTheme: () => {
    const currentTheme = get().theme;
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  toggleTheme: () => {
    const newTheme = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem("color-scheme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ theme: newTheme });
  }
}));
