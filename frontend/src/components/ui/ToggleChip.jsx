import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

export function ToggleChip({ selected, onToggle, icon: Icon, children, className, showCheck = true, role }) {
  return (
    <button
      type="button"
      role={role}
      aria-pressed={role ? undefined : selected}
      aria-checked={role ? selected : undefined}
      onClick={onToggle}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[0.8125rem] font-medium transition-colors focus-ring",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-foreground-secondary hover:border-border-strong hover:text-foreground",
        className
      )}
    >
      {selected && showCheck && !Icon && <Check size={13} aria-hidden="true" />}
      {Icon && <Icon size={14} aria-hidden="true" />}
      {children}
    </button>
  );
}
