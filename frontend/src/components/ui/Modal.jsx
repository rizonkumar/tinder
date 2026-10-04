import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { IconButton } from "./IconButton";

const SIZES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-2xl",
};

export function Modal({ open, onClose, title, description, icon: Icon, footer, children, className, bodyClassName, size = "md" }) {
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
              "relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-xl border border-border bg-surface text-foreground shadow-modal sm:max-h-[88dvh] sm:rounded-xl",
              SIZES[size],
              className
            )}
          >
            {title && (
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div className="flex min-w-0 items-start gap-3">
                  {Icon && (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background-secondary text-foreground-secondary">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <h2 className="heading-16 text-foreground">{title}</h2>
                    {description && <p className="copy-13 mt-0.5 text-foreground-secondary">{description}</p>}
                  </div>
                </div>
                <IconButton label="Close" size="sm" onClick={onClose} className="-mr-1.5 -mt-1">
                  <X />
                </IconButton>
              </div>
            )}
            <div className={cn("min-h-0 flex-1 overflow-y-auto", bodyClassName)}>{children}</div>
            {footer && (
              <div className="safe-bottom flex shrink-0 items-center justify-end gap-2 border-t border-border bg-background-secondary px-5 py-3">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
