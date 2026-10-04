import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { IconButton } from "./IconButton";

export function Modal({ open, onClose, title, children, className, size = "md" }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-overlay p-0 sm:items-center sm:p-4"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.175, 0.885, 0.32, 1.1] }}
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "relative w-full overflow-hidden rounded-t-xl border border-border bg-surface text-foreground shadow-modal sm:rounded-xl",
              size === "sm" && "sm:max-w-sm",
              size === "md" && "sm:max-w-md",
              size === "lg" && "sm:max-w-2xl",
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <h2 className="heading-16">{title}</h2>
                <IconButton label="Close" size="sm" onClick={onClose}>
                  <X />
                </IconButton>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
