import { cn } from "../../utils/cn";

export function PageHeader({ title, description, actions, meta, className }) {
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h1 className="heading-24 text-foreground">{title}</h1>
          {description && <p className="copy-14 mt-1 text-foreground-secondary">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {meta && <div className="flex flex-wrap items-center gap-2">{meta}</div>}
    </header>
  );
}

export function SectionHeader({ title, description, action, className }) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="heading-16 text-foreground">{title}</h2>
        {description && <p className="copy-13 mt-0.5 text-foreground-secondary">{description}</p>}
      </div>
      {action}
    </div>
  );
}
