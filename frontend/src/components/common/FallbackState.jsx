import { motion } from "framer-motion";

export default function FallbackState({
  icon: Icon,
  title,
  description,
  actions = [],
  className = "",
}) {
  return (
    <div className={`flex h-full flex-col items-center justify-center p-8 text-center max-w-md mx-auto select-none transition-colors duration-300 ${className}`}>
      {Icon && (
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-background-secondary text-foreground-secondary shadow-inner shrink-0">
          <Icon size={50} className={title?.includes("No Matches Yet") ? "fill-current animate-pulse" : ""} />
        </div>
      )}

      {title && (
        <h2 className="mb-3 text-3xl font-black text-foreground tracking-tight font-outfit uppercase">
          {title}
        </h2>
      )}

      {description && (
        <p className="mb-8 text-sm text-foreground-secondary leading-relaxed max-w-xs mx-auto font-medium">
          {description}
        </p>
      )}

      {actions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4">
          {actions.map((act, idx) => {
            const ActIcon = act.icon;
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={act.onClick}
                className={`flex items-center space-x-2 rounded-full px-6 py-3 font-bold text-sm shadow-card transition-all focus-ring ${
                  act.variant === "primary"
                    ? "bg-primary hover:bg-primary-hover text-primary-foreground"
                    : act.variant === "secondary"
                    ? "border border-border bg-background text-foreground hover:bg-surface-hover"
                    : "border border-border bg-background text-accent hover:bg-surface-hover"
                }`}
              >
                {ActIcon && <ActIcon size={16} />}
                <span>{act.label}</span>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
