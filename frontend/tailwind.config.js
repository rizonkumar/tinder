/** @type {import('tailwindcss').Config} */

// Geist scales backed by theme-swapping CSS variables (defined in index.css).
const scale = (name) =>
  Object.fromEntries(
    [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((step) => [
      step,
      `var(--${name}-${step})`,
    ])
  );

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        // Legacy alias: existing `font-outfit` usages now render in Geist Sans
        // so the app uses a single typeface without touching every file.
        outfit: ["Geist", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Semantic tokens
        background: {
          DEFAULT: "var(--background)",
          secondary: "var(--background-secondary)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          secondary: "var(--foreground-secondary)",
          muted: "var(--foreground-muted)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        surface: {
          hover: "var(--surface-hover)",
          active: "var(--surface-active)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          foreground: "var(--accent-foreground)",
        },
        ring: "var(--ring)",

        // State / accent scales
        gray: scale("gray"),
        blue: scale("blue"),
        red: scale("red"),
        amber: scale("amber"),
        green: scale("green"),
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        DEFAULT: "6px",
        md: "12px",
        lg: "16px",
        xl: "16px",
        "2xl": "16px",
        "3xl": "16px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 2px 2px rgba(0, 0, 0, 0.04)",
        popover:
          "0 1px 1px rgba(0,0,0,0.02), 0 4px 8px -4px rgba(0,0,0,0.04), 0 16px 24px -8px rgba(0,0,0,0.06)",
        modal:
          "0 1px 1px rgba(0,0,0,0.02), 0 8px 16px -4px rgba(0,0,0,0.04), 0 24px 32px -8px rgba(0,0,0,0.06)",
      },
      transitionTimingFunction: {
        geist: "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
