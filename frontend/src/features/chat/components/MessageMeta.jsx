import { CheckCheck, Timer } from "lucide-react";
import { BUBBLE_META_CLASS, formatClockTime } from "../utils/chatBubbleStyles";
import { cn } from "../../../utils/cn";

export function ReadReceipt({ read, readAt }) {
  const label = read && readAt ? `Read ${formatClockTime(readAt)}` : read ? "Read" : "Sent";
  return (
    <CheckCheck
      size={14}
      aria-label={label}
      className={read ? "text-accent" : "text-foreground-muted"}
    />
  );
}

export function MessageMeta({ message, isSentByMe, showReceipt = true, className }) {
  return (
    <div className={cn("mt-1 flex items-center justify-end gap-1 text-[11px] leading-none", BUBBLE_META_CLASS, className)}>
      {message.expiresAt && <Timer size={11} aria-label="Disappearing message" />}
      {message.isEdited && <span>Edited ·</span>}
      <span className="tabular">{formatClockTime(message.createdAt)}</span>
      {isSentByMe && showReceipt && <ReadReceipt read={message.read} readAt={message.readAt} />}
    </div>
  );
}
