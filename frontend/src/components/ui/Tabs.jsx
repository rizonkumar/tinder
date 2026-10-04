import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export function Tabs({ tabs, value, onChange, layoutId = "tabs-indicator", className }) {
  return (
    <div role="tablist" className={cn("flex items-center gap-6 border-b border-border", className)}>
      {tabs.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative -mb-px flex h-11 items-center gap-2 text-sm font-medium transition-colors focus-ring",
              selected ? "text-foreground" : "text-foreground-secondary hover:text-foreground"
            )}
          >
            {tab.icon && <tab.icon size={15} aria-hidden="true" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "tabular inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs",
                  selected ? "bg-primary text-primary-foreground" : "bg-background-secondary text-foreground-muted"
                )}
              >
                {tab.count}
              </span>
            )}
            {selected && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
