import { forwardRef, useId } from "react";
import { cn } from "../../utils/cn";

export const FIELD_CLASS =
  "w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-foreground-muted transition-colors duration-150 hover:border-border-strong focus:border-border-strong focus-ring disabled:cursor-not-allowed disabled:bg-background-secondary disabled:text-foreground-muted";

export function Field({ label, hint, error, required, children, className, id }) {
  const generated = useId();
  const fieldId = id || generated;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={fieldId} className="label-13 text-foreground">
          {label}
          {required && <span className="ml-0.5 text-accent" aria-hidden="true">*</span>}
        </label>
      )}
      {typeof children === "function" ? children(fieldId) : children}
      {error ? (
        <p className="copy-13 text-danger" role="alert">{error}</p>
      ) : hint ? (
        <p className="copy-13 text-foreground-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef(function Input({ icon: Icon, trailing, className, invalid, ...props }, ref) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
        />
      )}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(FIELD_CLASS, "h-10", Icon && "pl-9", trailing && "pr-10", invalid && "border-danger", className)}
        {...props}
      />
      {trailing && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</div>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(FIELD_CLASS, "min-h-[96px] resize-y py-2.5 leading-6", invalid && "border-danger", className)}
      {...props}
    />
  );
});
