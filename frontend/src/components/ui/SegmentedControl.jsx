import { cn } from "../../utils/cn";

export function SegmentedControl({ options, value, onChange, label, className, size = "md" }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex w-full rounded-md border border-border bg-background-secondary p-0.5", className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-[5px] font-medium capitalize transition-colors duration-150 focus-ring",
              size === "sm" ? "h-8 px-2 text-xs" : "h-9 px-3 text-sm",
              selected
                ? "bg-surface text-foreground shadow-card"
                : "text-foreground-secondary hover:text-foreground"
            )}
          >
            {option.icon && <option.icon size={14} aria-hidden="true" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
