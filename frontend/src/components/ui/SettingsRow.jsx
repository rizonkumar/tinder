import { cn } from "../../utils/cn";

export function SettingsRow({ icon: Icon, title, description, control, className }) {
  return (
    <div className={cn("flex items-center justify-between gap-4 px-5 py-4", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-background-secondary text-foreground-secondary">
            <Icon size={16} aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <p className="label-14 text-foreground">{title}</p>
          {description && <p className="copy-13 mt-0.5 text-foreground-secondary">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
