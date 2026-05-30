import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Sparkles, X, Heart, AlertCircle, Info, Check } from "lucide-react";

export function CustomToast({ t, type, message }) {
  const getColorsAndIcons = () => {
    switch (type) {
      case "success":
        return {
          icon: Check,
          color: "text-emerald-500 bg-emerald-50 border-emerald-100",
          progressBg: "bg-emerald-500",
          shadowColor: "shadow-emerald-500/5",
        };
      case "error":
        return {
          icon: AlertCircle,
          color: "text-rose-500 bg-rose-50 border-rose-100",
          progressBg: "bg-rose-500",
          shadowColor: "shadow-rose-500/5",
        };
      case "match":
        return {
          icon: Heart,
          color: "text-pink-500 bg-pink-50 border-pink-100",
          progressBg: "bg-pink-500",
          shadowColor: "shadow-pink-500/5",
        };
      case "info":
      default:
        return {
          icon: Info,
          color: "text-amber-500 bg-amber-50 border-amber-100",
          progressBg: "bg-amber-500",
          shadowColor: "shadow-amber-500/5",
        };
    }
  };

  const { icon: Icon, color, progressBg, shadowColor } = getColorsAndIcons();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 220 }}
      className={`pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-3xl border border-pink-100/50 bg-white/90 p-4 shadow-xl backdrop-blur-md select-none ${shadowColor}`}
    >
      <div className="flex w-full items-center justify-between space-x-3.5">
        <div className="flex items-center space-x-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${color} shadow-sm`}>
            <Icon size={18} className={type === "match" ? "fill-current animate-pulse" : ""} />
          </div>
          <p className="text-xs font-extrabold tracking-wide text-gray-800 leading-relaxed font-sans pr-4">
            {message}
          </p>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
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
