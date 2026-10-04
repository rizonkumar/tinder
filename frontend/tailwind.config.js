/** @type {import('tailwindcss').Config} */

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
      },
      colors: {
        background: {
          DEFAULT: "var(--background)",
          secondary: "var(--background-secondary)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
          hover: "var(--surface-hover)",
          active: "var(--surface-active)",
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
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          surface: "var(--accent-surface)",
          foreground: "var(--accent-foreground)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          strong: "var(--gold-strong)",
          surface: "var(--gold-surface)",
          ring: "var(--gold-ring)",
        },
        success: {
          DEFAULT: "var(--success)",
          surface: "var(--success-surface)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          hover: "var(--danger-hover)",
          surface: "var(--danger-surface)",
        },
        bubble: {
          sent: "var(--bubble-sent)",
          "sent-border": "var(--bubble-sent-border)",
          received: "var(--bubble-received)",
        },
        overlay: "var(--overlay)",
        ring: "var(--ring)",
        gray: scale("gray"),
        blue: scale("blue"),
        red: scale("red"),
        amber: scale("amber"),
        green: scale("green"),
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        popover: "var(--shadow-popover)",
        modal: "var(--shadow-modal)",
        none: "none",
      },
      maxWidth: {
        page: "72rem",
        narrow: "44rem",
      },
      spacing: {
        header: "var(--header-h)",
        tabbar: "var(--tabbar-h)",
      },
      transitionTimingFunction: {
        geist: "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 400ms cubic-bezier(0.175, 0.885, 0.32, 1.1) both",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
};
