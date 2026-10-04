import { Skeleton, Spinner } from "../ui/Skeleton";

export default function LoadingState({ message = "Loading", type = "inline" }) {
  if (type === "screen") {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <Spinner size={24} label={message} />
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <Skeleton className="aspect-[4/5] w-full rounded-none" />
        <div className="space-y-2.5 p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-32 w-full flex-col items-center justify-center gap-3 p-6 text-center">
      <Spinner size={type === "large" ? 24 : 20} label={message || "Loading"} />
      {message && <p className="copy-13 text-foreground-muted">{message}</p>}
    </div>
  );
}
