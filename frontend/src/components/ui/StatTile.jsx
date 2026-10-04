import { cn } from "../../utils/cn";

export function StatTile({ label, value, icon: Icon, hint, className }) {
  return (
    <div className={cn("flex flex-col gap-2 rounded-lg border border-border bg-surface p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="label-12 text-foreground-secondary">{label}</span>
        {Icon && <Icon size={14} className="text-foreground-muted" aria-hidden="true" />}
      </div>
      <span className="heading-24 tabular text-foreground">{value}</span>
      {hint && <span className="copy-13 text-foreground-muted">{hint}</span>}
    </div>
  );
}
