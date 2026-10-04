import { Badge } from "../../../components/ui/Badge";
import { formatClockTime } from "../utils/chatBubbleStyles";
import { cn } from "../../../utils/cn";

export default function ChatCard({ message, isSentByMe, isHighlighted, icon: Icon, eyebrow, title, subtitle, status, children, footer }) {
  return (
    <div id={`msg-${message._id}`} className={cn("my-4 flex w-full", isSentByMe ? "justify-end" : "justify-start")}>
      <article
        className={cn(
          "w-full max-w-[20rem] overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-shadow",
          isHighlighted && "ring-2 ring-ring ring-offset-2 ring-offset-background"
        )}
      >
        <header className="flex items-start justify-between gap-3 p-4 pb-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-background-secondary text-foreground">
              <Icon size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-foreground-muted">{eyebrow}</p>
              <p className="heading-14 truncate text-foreground">{title}</p>
              {subtitle && <p className="truncate text-xs text-foreground-secondary">{subtitle}</p>}
            </div>
          </div>
          {status && (
            <Badge tone={status.tone} icon={status.icon} className="h-5 px-2 text-[11px]">
              {status.label}
            </Badge>
          )}
        </header>
        <div className="px-4 pb-4">{children}</div>
        <footer className="flex items-center justify-between gap-3 border-t border-border bg-background-secondary px-4 py-2.5">
          <div className="min-w-0 flex-1">{footer}</div>
          <span className="tabular shrink-0 text-[11px] text-foreground-muted">{formatClockTime(message.createdAt)}</span>
        </footer>
      </article>
    </div>
  );
}
