import { cn } from "../../../utils/cn";

const SURFACE = {
  sent: "border border-bubble-sent-border bg-bubble-sent text-foreground",
  received: "border border-border bg-bubble-received text-foreground",
};

const SHAPE = {
  text: "max-w-[85%] rounded-2xl px-3.5 py-2 copy-14 sm:max-w-[70%]",
  image: "max-w-[75%] rounded-2xl p-1 sm:max-w-[60%]",
  voice_note: "max-w-[90%] rounded-2xl px-3 py-2.5 sm:max-w-[75%]",
};

export const BUBBLE_META_CLASS = "text-foreground-muted";
export const BUBBLE_LINK_CLASS =
  "underline decoration-foreground-muted underline-offset-2 hover:decoration-foreground";

export function getBubbleClass(type, isSentByMe, isFirstOfGroup) {
  return cn(
    SHAPE[type] || SHAPE.text,
    isSentByMe ? SURFACE.sent : SURFACE.received,
    isFirstOfGroup && (isSentByMe ? "rounded-tr-md" : "rounded-tl-md")
  );
}

export function formatClockTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
