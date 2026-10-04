import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const VARIANTS = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-hover active:bg-surface-active",
  ghost: "text-foreground-secondary hover:bg-surface-hover hover:text-foreground",
  accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
  danger: "bg-danger text-white hover:bg-danger-hover",
  "danger-outline":
    "border border-border bg-surface text-danger hover:bg-danger-surface hover:border-danger/40",
};

const SIZES = {
  sm: "h-8 px-3 text-[0.8125rem] gap-1.5 [&_svg]:size-3.5",
  md: "h-10 px-4 text-sm gap-2 [&_svg]:size-4",
  lg: "h-11 px-5 text-sm gap-2 [&_svg]:size-4",
};

export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    className,
    children,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors duration-150 focus-ring disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:shrink-0",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});
