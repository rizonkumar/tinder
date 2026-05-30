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
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pink-100/60 dark:bg-pink-950/20 text-pink-500 shadow-inner shrink-0">
          <Icon size={50} className={title?.includes("No Matches Yet") ? "fill-current animate-pulse" : ""} />
        </div>
      )}
      
      {title && (
        <h2 className="mb-3 text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight font-outfit uppercase">
          {title}
        </h2>
      )}

      {description && (
        <p className="mb-8 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto font-medium">
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
                className={`flex items-center space-x-2 rounded-full px-6 py-3 font-bold text-sm shadow-md transition-all focus:outline-none ${
                  act.variant === "primary"
                    ? "bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white shadow-sm hover:shadow"
                    : act.variant === "secondary"
                    ? "border border-yellow-250 dark:border-yellow-950/30 bg-white dark:bg-zinc-900 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
                    : "border border-pink-100/40 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/15"
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
