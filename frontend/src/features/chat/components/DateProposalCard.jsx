import { Calendar, Clock, MapPin, X, Heart } from "lucide-react";
import { ACTIVITY_OPTIONS, DEFAULT_ACTIVITY } from "../../../constants";

export default function DateProposalCard({
  message,
  isSentByMe,
  isHighlighted,
  activeChatUserName,
  onRespond,
}) {
  const info = message.dateInfo || {};
  const act = ACTIVITY_OPTIONS[info.activity] || DEFAULT_ACTIVITY;
  const IconComponent = act.icon || Calendar;

  const isPending = info.status === "pending";
  const isAccepted = info.status === "accepted";
  const isDeclined = info.status === "declined";

  const cardSurface = isAccepted
    ? "bg-gray-100 border-green-300"
    : isDeclined
      ? "bg-gray-100 border-border opacity-60"
      : "bg-gray-100 border-border";

  const accentBar = isAccepted
    ? "bg-green-700"
    : isDeclined
      ? "bg-gray-400"
      : "bg-accent";

  const iconSurface = isAccepted
    ? "bg-green-700 text-white"
    : isDeclined
      ? "bg-gray-300 text-foreground"
      : "bg-primary text-primary-foreground";

  return (
    <div
      id={`msg-${message._id}`}
      className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-4 transition-all duration-300 ${
        isHighlighted ? "scale-[1.02]" : ""
      }`}
    >
      <div
        className={`w-full max-w-[310px] rounded-md p-5 shadow-card border relative overflow-hidden transition-all duration-200 ${cardSurface} ${
          isHighlighted ? "ring-2 ring-ring" : ""
        }`}
      >
        <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentBar}`} />

        <div className="flex items-center justify-between mb-4 mt-0.5 select-none">
          <span className="text-[9px] font-black uppercase tracking-widest text-foreground-muted font-outfit">
            Date Proposal
          </span>
          {isAccepted && (
            <span className="flex items-center space-x-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-700" />
              <span>Confirmed</span>
            </span>
          )}
          {isDeclined && (
            <span className="flex items-center space-x-1.5 rounded-full bg-surface-active px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-foreground-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
              <span>Declined</span>
            </span>
          )}
          {isPending && (
            <span className="flex items-center space-x-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Pending</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3.5 mb-4">
          <div
            className={`relative flex h-11 w-11 items-center justify-center rounded-md shrink-0 ${iconSurface}`}
          >
            <IconComponent size={20} className="stroke-[2.2]" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-extrabold text-foreground font-outfit tracking-tight leading-none mb-1.5">
              {act.label}
            </h4>
            <p className="text-[9px] text-foreground-muted truncate font-bold font-outfit uppercase tracking-wider">
              Suggested by {isSentByMe ? "You" : activeChatUserName}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-foreground-secondary font-medium font-sans mb-4 border-t border-b border-border py-3 mt-1 select-none">
          <div className="flex items-center space-x-2.5">
            <Calendar size={13} className="text-foreground-muted shrink-0" />
            <span className="truncate">{info.date}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Clock size={13} className="text-foreground-muted shrink-0" />
            <span className="truncate">{info.time}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <MapPin size={13} className="text-foreground-muted shrink-0" />
            <span className="truncate font-semibold">
              {info.location || "To be decided"}
            </span>
          </div>
        </div>

        {isPending && (
          <div className="w-full mt-2">
            {isSentByMe ? (
              <div className="flex items-center justify-center space-x-2 text-center text-[10px] text-foreground-muted bg-background rounded-md py-2.5 font-outfit font-semibold tracking-wide border border-border">
                <Clock size={12} />
                <span>Awaiting {activeChatUserName}&apos;s reply</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5 w-full">
                <button
                  type="button"
                  onClick={() => onRespond(message._id, "declined")}
                  className="flex-1 py-2 rounded-md text-[10px] font-bold text-red-800 border border-border bg-background hover:bg-surface-hover transition-colors font-outfit focus:outline-none flex items-center justify-center space-x-1.5 uppercase tracking-wider"
                >
                  <X size={12} />
                  <span>Decline</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRespond(message._id, "accepted")}
                  className="flex-1 py-2 rounded-md text-[10px] font-bold text-white bg-green-700 hover:bg-green-800 transition-colors font-outfit focus:outline-none flex items-center justify-center space-x-1.5 uppercase tracking-wider"
                >
                  <Heart size={12} className="fill-white" />
                  <span>Accept</span>
                </button>
              </div>
            )}
          </div>
        )}

        <span className="block text-[8px] mt-2.5 text-right font-medium text-foreground-muted font-sans">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
