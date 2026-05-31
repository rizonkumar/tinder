import { Calendar, Clock, MapPin, X, Heart } from "lucide-react";
import {
  ACTIVITY_OPTIONS,
  DEFAULT_ACTIVITY,
} from "../../../constants";

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

  return (
    <div
      id={`msg-${message._id}`}
      className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-4 transition-all duration-300 ${
        isHighlighted ? "scale-[1.02]" : ""
      }`}
    >
      <div
        className={`w-full max-w-[310px] rounded-2xl p-5 shadow-sm border relative overflow-hidden transition-all duration-200 ${
          isAccepted
            ? "bg-white dark:bg-zinc-900 border-emerald-200 dark:border-emerald-800/40"
            : isDeclined
              ? "bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 opacity-50"
              : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
        } ${
          isHighlighted
            ? "ring-4 ring-pink-500/40 shadow-lg shadow-pink-500/30"
            : ""
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-[3px] ${
            isAccepted
              ? "bg-emerald-500"
              : isDeclined
                ? "bg-slate-300 dark:bg-zinc-700"
                : "bg-pink-500"
          }`}
        />

        <div className="flex items-center justify-between mb-4 mt-0.5 select-none">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-outfit">
            Date Proposal
          </span>
          {isAccepted && (
            <span className="flex items-center space-x-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Confirmed</span>
            </span>
          )}
          {isDeclined && (
            <span className="flex items-center space-x-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-zinc-600" />
              <span>Declined</span>
            </span>
          )}
          {isPending && (
            <span className="flex items-center space-x-1.5 rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Pending</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3.5 mb-4">
          <div
            className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${
              isAccepted
                ? "bg-emerald-500"
                : isDeclined
                  ? "bg-slate-300 dark:bg-zinc-700"
                  : "bg-pink-500"
            } text-white shrink-0`}
          >
            <IconComponent size={20} className="stroke-[2.2]" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-zinc-100 font-outfit tracking-tight leading-none mb-1.5">
              {act.label}
            </h4>
            <p className="text-[9px] text-slate-400 dark:text-zinc-500 truncate font-bold font-outfit uppercase tracking-wider">
              Suggested by {isSentByMe ? "You" : activeChatUserName}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-300 font-medium font-sans mb-4 border-t border-b border-slate-100 dark:border-zinc-800 py-3 mt-1 select-none">
          <div className="flex items-center space-x-2.5">
            <Calendar
              size={13}
              className="text-slate-400 dark:text-zinc-500 shrink-0"
            />
            <span className="truncate">{info.date}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Clock
              size={13}
              className="text-slate-400 dark:text-zinc-500 shrink-0"
            />
            <span className="truncate">{info.time}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <MapPin
              size={13}
              className="text-slate-400 dark:text-zinc-500 shrink-0"
            />
            <span className="truncate font-semibold">
              {info.location || "To be decided"}
            </span>
          </div>
        </div>

        {isPending && (
          <div className="w-full mt-2">
            {isSentByMe ? (
              <div className="flex items-center justify-center space-x-2 text-center text-[10px] text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-800/50 rounded-xl py-2.5 font-outfit font-semibold tracking-wide">
                <Clock size={12} />
                <span>Awaiting {activeChatUserName}&apos;s reply</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5 w-full">
                <button
                  onClick={() => onRespond(message._id, "declined")}
                  className="flex-1 py-2 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-700 transition-colors font-outfit focus:outline-none flex items-center justify-center space-x-1.5 uppercase tracking-wider"
                >
                  <X size={12} />
                  <span>Decline</span>
                </button>
                <button
                  onClick={() => onRespond(message._id, "accepted")}
                  className="flex-1 py-2 rounded-xl text-[10px] font-bold text-white bg-pink-500 hover:bg-pink-600 active:bg-pink-700 transition-colors font-outfit focus:outline-none flex items-center justify-center space-x-1.5 uppercase tracking-wider"
                >
                  <Heart size={12} className="fill-white" />
                  <span>Accept</span>
                </button>
              </div>
            )}
          </div>
        )}

        <span className="block text-[8px] mt-2.5 text-right font-medium text-slate-400 dark:text-slate-550 font-sans">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
