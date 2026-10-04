import { useEffect, useRef, useState } from "react";
import { Ban, Pause, Play } from "lucide-react";
import LinkPreviewCard from "./LinkPreviewCard";
import { MessageMeta } from "./MessageMeta";
import { isEmojiOnly } from "../utils/isEmojiOnly";
import { linkify, extractFirstUrl } from "../utils/linkify";
import { BUBBLE_LINK_CLASS, BUBBLE_META_CLASS } from "../utils/chatBubbleStyles";
import { cn } from "../../../utils/cn";

const PLAYBACK_RATES = [1, 1.5, 2];

function formatSeconds(value) {
  if (!Number.isFinite(value)) return "0:00";
  const mins = Math.floor(value / 60);
  const secs = Math.floor(value % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function DeletedBody({ label = "This message was deleted", className }) {
  return (
    <p className={cn("flex items-center gap-1.5 copy-13 italic text-foreground-muted", className)}>
      <Ban size={13} aria-hidden="true" />
      {label}
    </p>
  );
}

export function TextBody({ message, isSentByMe }) {
  if (message.isDeleted) return <DeletedBody />;

  const emojiOnly = isEmojiOnly(message.content);
  const previewUrl = extractFirstUrl(message.content);

  return (
    <>
      <p className={emojiOnly ? "text-4xl leading-tight" : "whitespace-pre-wrap break-words"}>
        {linkify(message.content, BUBBLE_LINK_CLASS)}
      </p>
      {previewUrl && <LinkPreviewCard url={previewUrl} />}
      <MessageMeta message={message} isSentByMe={isSentByMe} />
    </>
  );
}

export function ImageBody({ message, isSentByMe, onOpenLightbox }) {
  if (message.isDeleted) return <DeletedBody label="This photo was deleted" className="px-2.5 py-1.5" />;

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenLightbox(message.mediaUrl)}
        className="block w-full overflow-hidden rounded-xl focus-ring"
        aria-label="Open photo"
      >
        <img
          src={message.mediaUrl}
          alt="Shared photo"
          loading="lazy"
          className="max-h-72 w-full object-cover transition-opacity hover:opacity-95"
        />
      </button>
      <MessageMeta message={message} isSentByMe={isSentByMe} className="px-1.5 pb-0.5" />
    </>
  );
}

export function VoiceBody({ message, isSentByMe }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rateIndex, setRateIndex] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const handlers = {
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      timeupdate: () => setCurrentTime(audio.currentTime),
      loadedmetadata: () => setDuration(audio.duration),
      ended: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
    };
    Object.entries(handlers).forEach(([event, handler]) => audio.addEventListener(event, handler));
    return () => Object.entries(handlers).forEach(([event, handler]) => audio.removeEventListener(event, handler));
  }, []);

  if (message.isDeleted) return <DeletedBody />;

  const togglePlayback = () => (isPlaying ? audioRef.current.pause() : audioRef.current.play());

  const seek = (event) => {
    const value = parseFloat(event.target.value);
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const cycleRate = () => {
    const next = (rateIndex + 1) % PLAYBACK_RATES.length;
    audioRef.current.playbackRate = PLAYBACK_RATES[next];
    setRateIndex(next);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div className="flex min-w-[15rem] items-center gap-3">
        <audio ref={audioRef} src={message.mediaUrl} preload="metadata" />
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover focus-ring"
        >
          {isPlaying ? <Pause size={15} className="fill-current" /> : <Play size={15} className="ml-0.5 fill-current" />}
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="relative h-1.5 rounded-full bg-border">
            <div className="absolute inset-y-0 left-0 rounded-full bg-foreground" style={{ width: `${progress}%` }} />
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.01"
              value={currentTime}
              onChange={seek}
              aria-label="Seek voice message"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
          <span className={cn("tabular text-[11px]", BUBBLE_META_CLASS)}>
            {formatSeconds(currentTime)} / {formatSeconds(duration)}
          </span>
        </div>
        <button
          type="button"
          onClick={cycleRate}
          aria-label={`Playback speed ${PLAYBACK_RATES[rateIndex]}x`}
          className="tabular h-6 shrink-0 rounded-full border border-border bg-surface px-2 text-[11px] font-medium text-foreground-secondary transition-colors hover:text-foreground focus-ring"
        >
          {PLAYBACK_RATES[rateIndex]}x
        </button>
      </div>
      <MessageMeta message={message} isSentByMe={isSentByMe} />
    </>
  );
}
