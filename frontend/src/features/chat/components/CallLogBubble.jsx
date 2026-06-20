import { Phone, Video } from "lucide-react";

export default function CallLogBubble({ message }) {
  const isMissed = message.content.toLowerCase().includes("missed");
  const CallIcon = message.messageType === "video" ? Video : Phone;

  return (
    <div className="flex justify-center my-2">
      <div className="flex items-center space-x-2.5 rounded-2xl bg-background border border-border px-4 py-2 text-xs font-semibold text-foreground-secondary shadow-card">
        <CallIcon
          size={13}
          className={
            isMissed ? "text-red-800 animate-pulse" : "text-green-700"
          }
        />
        <span className="font-outfit">{message.content}</span>
        <span className="text-[9px] text-foreground-muted font-medium ml-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
