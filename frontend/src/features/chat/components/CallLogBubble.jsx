import { Video, PhoneOutgoing, PhoneIncoming, PhoneMissed } from "lucide-react";
import { CALL_STATUSES } from "../../../constants";
import { formatClockTime } from "../utils/chatBubbleStyles";
import { cn } from "../../../utils/cn";

function formatCallDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

export default function CallLogBubble({ message, isSentByMe }) {
  const info = message.callInfo;
  const isVideo = message.messageType === "video";
  const missed = info
    ? info.status === CALL_STATUSES.MISSED || info.status === CALL_STATUSES.REJECTED
    : message.content.toLowerCase().includes("missed");
  const duration = info?.duration || 0;

  let CallIcon = isSentByMe ? PhoneOutgoing : PhoneIncoming;
  if (isVideo) CallIcon = Video;
  else if (missed) CallIcon = PhoneMissed;

  const label = `${missed ? "Missed " : ""}${isVideo ? "video" : "voice"} call`;
  const durationText = !missed && duration > 0 ? formatCallDuration(duration) : null;

  return (
    <div className="my-3 flex justify-center">
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[0.8125rem] text-foreground-secondary">
        <CallIcon size={14} className={cn("shrink-0", missed ? "text-danger" : "text-success")} aria-hidden="true" />
        <span className="font-medium text-foreground first-letter:uppercase">{label}</span>
        {durationText && <span className="tabular">· {durationText}</span>}
        <span className="tabular text-foreground-muted">· {formatClockTime(message.createdAt)}</span>
      </div>
    </div>
  );
}
