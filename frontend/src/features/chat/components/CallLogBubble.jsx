import { Phone, Video } from "lucide-react";

export default function CallLogBubble({ message }) {
  const isMissed = message.content.toLowerCase().includes("missed");
  const CallIcon = message.messageType === "video" ? Video : Phone;

  return (
    <div className="flex justify-center my-2">
      <div className="flex items-center space-x-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 shadow-sm">
        <CallIcon
          size={13}
          className={
            isMissed ? "text-red-500 animate-pulse" : "text-green-500"
          }
        />
        <span className="font-outfit">{message.content}</span>
        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium ml-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
