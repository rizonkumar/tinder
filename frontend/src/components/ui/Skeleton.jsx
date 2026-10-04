import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-gray-200", className)} />;
}

export function Spinner({ className, size = 20, label = "Loading" }) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex items-center justify-center text-foreground-muted", className)}>
      <Loader2 size={size} className="animate-spin" aria-hidden="true" />
    </span>
  );
}

export function LoadingBlock({ label = "Loading", className }) {
  return (
    <div className={cn("flex h-48 w-full items-center justify-center", className)}>
      <Spinner label={label} />
    </div>
  );
}

export function CardGridSkeleton({ count = 6, aspect = "aspect-[4/5]" }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-border bg-surface">
          <Skeleton className={cn("w-full rounded-none", aspect)} />
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
