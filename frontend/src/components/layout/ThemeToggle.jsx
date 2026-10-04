import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";
import { IconButton } from "../ui/IconButton";

export function ThemeToggle({ variant = "ghost", className }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";
  return (
    <IconButton
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      variant={variant}
      onClick={toggleTheme}
      className={className}
    >
      {isDark ? <Sun /> : <Moon />}
    </IconButton>
  );
}
