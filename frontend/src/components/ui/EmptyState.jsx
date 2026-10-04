import { cn } from "../../utils/cn";
import { Button } from "./Button";

export function EmptyState({ icon: Icon, title, description, actions = [], className, compact = false }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center text-center",
        compact ? "gap-2 px-4 py-10" : "gap-3 px-6 py-16",
        className
      )}
    >
      {Icon && (
        <span className="flex size-11 items-center justify-center rounded-full bg-background-secondary text-foreground-secondary">
          <Icon size={20} aria-hidden="true" />
        </span>
      )}
      <div className="space-y-1">
        <p className="heading-14 text-foreground">{title}</p>
        {description && <p className="copy-13 mx-auto max-w-sm text-foreground-secondary">{description}</p>}
      </div>
      {actions.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {actions.map((action) => {
            const ActionIcon = action.icon;
            return (
              <Button
                key={action.label}
                size="sm"
                variant={action.variant || "primary"}
                onClick={action.onClick}
              >
                {ActionIcon && <ActionIcon aria-hidden="true" />}
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
