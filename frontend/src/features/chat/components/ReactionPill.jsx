import { cn } from "../../../utils/cn";

export default function ReactionPill({ reaction, isSentByMe, onRemove }) {
  if (!reaction) return null;
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove reaction ${reaction}`}
      title="Remove reaction"
      className={cn(
        "absolute -bottom-3 flex h-6 items-center rounded-full border border-border bg-surface px-1.5 text-[13px] leading-none shadow-card transition-colors hover:bg-surface-raised focus-ring",
        isSentByMe ? "left-2" : "right-2"
      )}
    >
      {reaction}
    </button>
  );
}
