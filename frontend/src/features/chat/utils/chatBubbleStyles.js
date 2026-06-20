const SENT_SURFACE = "bg-blue-200 text-blue-1000 border border-blue-300";
const RECEIVED_SURFACE = "bg-gray-100 text-foreground border border-border";

function cornerClass(isSentByMe, isFirstOfGroup) {
  if (!isFirstOfGroup) return "";
  return isSentByMe ? "rounded-tr-none" : "rounded-tl-none";
}

export function getBubbleClass(type, isSentByMe, isFirstOfGroup) {
  const surface = isSentByMe ? SENT_SURFACE : RECEIVED_SURFACE;
  const corner = cornerClass(isSentByMe, isFirstOfGroup);

  if (type === "image") {
    return `max-w-[65%] rounded-md shadow-card p-1 ${surface} ${corner}`;
  }
  if (type === "voice_note") {
    return `max-w-[75%] rounded-md p-3 shadow-card ${surface} ${corner}`;
  }
  return `max-w-[70%] rounded-md px-4 py-2.5 text-sm shadow-card leading-relaxed font-sans ${surface} ${corner}`;
}

export function metaTextClass(isSentByMe) {
  return isSentByMe ? "text-blue-1000/70" : "text-foreground-muted";
}

export function linkTextClass(isSentByMe) {
  return isSentByMe
    ? "underline underline-offset-2 text-blue-1000 font-semibold"
    : "underline underline-offset-2 text-accent";
}
