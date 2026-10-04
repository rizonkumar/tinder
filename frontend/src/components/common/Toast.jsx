import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { X, Heart, AlertCircle, Info, Check } from "lucide-react";
import { cn } from "../../utils/cn";

const TONES = {
  success: { icon: Check, className: "bg-success-surface text-success" },
  error: { icon: AlertCircle, className: "bg-danger-surface text-danger" },
  match: { icon: Heart, className: "bg-accent-surface text-accent" },
  info: { icon: Info, className: "bg-background-secondary text-foreground-secondary" },
};

function CustomToast({ t, type, message }) {
  const tone = TONES[type] || TONES.info;
  const Icon = tone.icon;
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border border-border bg-surface p-3 pr-2 shadow-popover"
    >
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-md", tone.className)}>
        <Icon size={15} className={type === "match" ? "fill-current" : undefined} aria-hidden="true" />
      </span>
      <p className="label-13 flex-1 text-foreground">{message}</p>
      <button
        type="button"
        onClick={() => toast.dismiss(t.id)}
        aria-label="Dismiss"
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-ring"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

const show = (type) => (message) => toast.custom((t) => <CustomToast t={t} type={type} message={message} />);

const showToast = {
  success: show("success"),
  error: show("error"),
  info: show("info"),
  match: show("match"),
};

export default showToast;
