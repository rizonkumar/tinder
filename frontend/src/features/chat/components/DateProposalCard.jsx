import { Calendar, Clock, MapPin, X, Check, CircleDashed } from "lucide-react";
import { ACTIVITY_OPTIONS, DEFAULT_ACTIVITY } from "../../../constants";
import { formatDisplayDate } from "../../../utils/dateUtils";
import { Button } from "../../../components/ui/Button";
import ChatCard from "./ChatCard";

const STATUS = {
  pending: { tone: "neutral", label: "Pending", icon: CircleDashed },
  accepted: { tone: "success", label: "Confirmed", icon: Check },
  declined: { tone: "danger", label: "Declined", icon: X },
};

function DetailRow({ icon: Icon, children }) {
  return (
    <li className="flex items-center gap-2.5 text-[0.8125rem] text-foreground">
      <Icon size={14} className="shrink-0 text-foreground-muted" aria-hidden="true" />
      <span className="truncate">{children}</span>
    </li>
  );
}

export default function DateProposalCard({ message, isSentByMe, isHighlighted, activeChatUserName, onRespond }) {
  const info = message.dateInfo || {};
  const activity = ACTIVITY_OPTIONS[info.activity] || DEFAULT_ACTIVITY;
  const status = STATUS[info.status] || STATUS.pending;
  const isPending = info.status === "pending";

  const footer = isPending ? (
    isSentByMe ? (
      <span className="text-xs text-foreground-secondary">Waiting for {activeChatUserName}</span>
    ) : (
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => onRespond(message._id, "declined")}>
          Decline
        </Button>
        <Button size="sm" onClick={() => onRespond(message._id, "accepted")}>
          Accept
        </Button>
      </div>
    )
  ) : (
    <span className="text-xs text-foreground-secondary">
      {info.status === "accepted" ? "Added to your Dates" : "This proposal was declined"}
    </span>
  );

  return (
    <ChatCard
      message={message}
      isSentByMe={isSentByMe}
      isHighlighted={isHighlighted}
      icon={activity.icon || Calendar}
      eyebrow={isSentByMe ? "You proposed a date" : `${activeChatUserName} proposed a date`}
      title={activity.label}
      status={status}
      footer={footer}
    >
      <ul className="space-y-2 rounded-lg border border-border px-3 py-2.5">
        <DetailRow icon={Calendar}>{formatDisplayDate(info.date)}</DetailRow>
        <DetailRow icon={Clock}>{info.time}</DetailRow>
        <DetailRow icon={MapPin}>{info.location || "Place to be decided"}</DetailRow>
      </ul>
    </ChatCard>
  );
}
