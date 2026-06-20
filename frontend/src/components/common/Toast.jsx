import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { X, Heart, AlertCircle, Info, Check } from "lucide-react";

export function CustomToast({ t, type, message }) {
  const getColorsAndIcons = () => {
    switch (type) {
      case "success":
        return {
          icon: Check,
          color: "text-green-700 bg-green-100 border-border",
          progressBg: "bg-green-700",
          shadowColor: "",
        };
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-800 bg-red-100 border-border",
          progressBg: "bg-red-800",
          shadowColor: "",
        };
      case "match":
        return {
          icon: Heart,
          color: "text-green-700 bg-green-100 border-border",
          progressBg: "bg-green-700",
          shadowColor: "",
        };
      case "info":
      default:
        return {
          icon: Info,
          color: "text-accent bg-accent/10 border-border",
          progressBg: "bg-accent",
          shadowColor: "",
        };
    }
  };

  const { icon: Icon, color, shadowColor } = getColorsAndIcons();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 220 }}
      className={`pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-md border border-border bg-background p-4 shadow-popover select-none ${shadowColor}`}
    >
      <div className="flex w-full items-center justify-between space-x-3.5">
        <div className="flex items-center space-x-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${color} shadow-card`}>
            <Icon size={18} className={type === "match" ? "fill-current animate-pulse" : ""} />
          </div>
          <p className="text-xs font-extrabold tracking-wide text-foreground leading-relaxed font-sans pr-4">
            {message}
          </p>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background-secondary hover:bg-surface-hover text-foreground-muted hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export const showToast = {
  success: (message) => {
    toast.custom((t) => <CustomToast t={t} type="success" message={message} />);
  },
  error: (message) => {
    toast.custom((t) => <CustomToast t={t} type="error" message={message} />);
  },
  info: (message) => {
    toast.custom((t) => <CustomToast t={t} type="info" message={message} />);
  },
  match: (message) => {
    toast.custom((t) => <CustomToast t={t} type="match" message={message} />);
  },
};

export default showToast;
