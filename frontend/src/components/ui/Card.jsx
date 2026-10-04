import { cn } from "../../utils/cn";

export function Card({ as: Tag = "div", className, interactive = false, ...props }) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-border bg-surface shadow-card",
        interactive &&
          "transition-colors duration-150 hover:border-border-strong hover:bg-surface-raised",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-border px-5 py-4", className)}>
      <div className="min-w-0">
        <h3 className="heading-16 text-foreground">{title}</h3>
        {description && <p className="copy-13 mt-0.5 text-foreground-secondary">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }) {
  return <div className={cn("p-5", className)} {...props} />;
}
