import { cn } from "../../utils/cn";

const SIZES = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-16",
  "2xl": "size-24",
  "3xl": "size-32",
};

const DOT_SIZES = {
  xs: "size-1.5 border",
  sm: "size-2 border",
  md: "size-2.5 border-2",
  lg: "size-3 border-2",
  xl: "size-3.5 border-2",
  "2xl": "size-4 border-2",
  "3xl": "size-5 border-[3px]",
};

export function Avatar({ src, alt, size = "md", online, gold = false, className }) {
  return (
    <span className={cn("relative inline-block shrink-0", SIZES[size], className)}>
      <img
        src={src || "/avatar.png"}
        alt={alt || ""}
        className={cn(
          "size-full rounded-full object-cover",
          gold ? "ring-2 ring-gold-ring ring-offset-2 ring-offset-surface" : "border border-border"
        )}
      />
      {online !== undefined && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-surface",
            DOT_SIZES[size],
            online ? "bg-success" : "bg-gray-500"
          )}
        />
      )}
    </span>
  );
}
