import { cn } from "../../utils/cn";

const TONES = {
  neutral: "border-border bg-background-secondary text-foreground-secondary",
  accent: "border-transparent bg-accent-surface text-accent",
  gold: "border-transparent bg-gold-surface text-gold-strong",
  success: "border-transparent bg-success-surface text-success",
  danger: "border-transparent bg-danger-surface text-danger",
  outline: "border-border bg-transparent text-foreground-secondary",
};

export function Badge({ tone = "neutral", icon: Icon, className, children }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {Icon && <Icon size={12} aria-hidden="true" />}
      {children}
    </span>
  );
}
