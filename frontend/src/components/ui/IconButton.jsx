import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const VARIANTS = {
  ghost: "text-foreground-secondary hover:bg-surface-hover hover:text-foreground",
  outline:
    "border border-border bg-surface text-foreground-secondary hover:bg-surface-hover hover:text-foreground",
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
  overlay: "bg-black/45 text-white hover:bg-black/60",
};

const SIZES = {
  sm: "size-8 [&_svg]:size-4",
  md: "size-9 [&_svg]:size-[18px]",
  lg: "size-11 [&_svg]:size-5",
  xl: "size-14 [&_svg]:size-6",
};

export const IconButton = forwardRef(function IconButton(
  {
    label,
    variant = "ghost",
    size = "md",
    active = false,
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
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-md transition-colors duration-150 focus-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0",
        VARIANTS[variant],
        active && "bg-surface-active text-foreground",
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
