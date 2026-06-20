import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Heart,
  Video,
  PhoneOutgoing,
  PhoneIncoming,
  PhoneMissed,
  Play,
  Pause,
  Volume2,
  Trash,
  Pin,
  X,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMessageStore } from "../../../store/useMessageStore";
import { CALL_STATUSES } from "../../../constants";
import LoadingState from "../../../components/common/LoadingState";
import FallbackState from "../../../components/common/FallbackState";
import MessageShell, { MessageMeta } from "./MessageShell";
import DateProposalCard from "./DateProposalCard";
import TwoTruthsLieCard from "./TwoTruthsLieCard";
import LinkPreviewCard from "./LinkPreviewCard";
import { isEmojiOnly } from "../utils/isEmojiOnly";
import { linkify, extractFirstUrl } from "../utils/linkify";
import { getBubbleClass, metaTextClass, linkTextClass } from "../utils/chatBubbleStyles";
import { decorateMessages, formatDateSeparator } from "../utils/messageGrouping";

const PINNED_LABELS = {
  image: "Photo",
  voice_note: "Voice message",
  date_proposal: "Date proposal",
  game_ttal: "Two Truths & a Lie",
};

const CARD_TYPES = ["date_proposal", "game_ttal", "audio", "video"];

function formatCallDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function CallLogBubble({ message, isSentByMe }) {
  const info = message.callInfo;
  const isVideo = message.messageType === "video";
  const missed = info
    ? info.status === CALL_STATUSES.MISSED || info.status === CALL_STATUSES.REJECTED
    : message.content.toLowerCase().includes("missed");
  const duration = info?.duration || 0;

  let CallIcon;
  if (isVideo) CallIcon = Video;
  else if (missed) CallIcon = PhoneMissed;
  else CallIcon = isSentByMe ? PhoneOutgoing : PhoneIncoming;

  const label = isVideo
    ? missed
      ? "Missed video call"
      : "Video call"
    : missed
      ? "Missed voice call"
      : "Voice call";
  const durationText = !missed && duration > 0 ? formatCallDuration(duration) : null;

  return (
    <div className="flex justify-center my-2">
      <div className="flex items-center space-x-2.5 rounded-full bg-background border border-border px-4 py-2 text-xs font-semibold text-foreground-secondary shadow-card">
        <CallIcon
          size={14}
          className={missed ? "text-red-700" : "text-green-700"}
        />
        <span className="font-outfit">{label}</span>
        {durationText && (
          <span className="text-foreground-muted font-medium">· {durationText}</span>
        )}
        <span className="text-[9px] text-foreground-muted font-medium ml-0.5">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function TextBody({ message, isSentByMe }) {
  if (message.isDeleted) {
    return (
      <p className="italic opacity-70 flex items-center gap-1.5">
        <Trash size={12} />
        <span>This message was deleted</span>
      </p>
    );
  }

  const emojiOnly = isEmojiOnly(message.content);
  const previewUrl = extractFirstUrl(message.content);

  return (
    <>
      <p className={emojiOnly ? "text-4xl leading-tight" : "break-words"}>
        {linkify(message.content, linkTextClass(isSentByMe))}
      </p>
      {message.isEdited && (
        <span className={`block text-[8px] text-right font-medium font-sans ${metaTextClass(isSentByMe)}`}>
          (edited)
        </span>
      )}
      {previewUrl && <LinkPreviewCard url={previewUrl} isSentByMe={isSentByMe} />}
      {!emojiOnly && <MessageMeta message={message} isSentByMe={isSentByMe} />}
    </>
  );
}

function ImageBody({ message, isSentByMe, onOpenLightbox }) {
  if (message.isDeleted) {
    return (
      <div className="flex items-center space-x-2 text-xs py-2.5 px-4 select-none italic opacity-75 text-foreground-secondary">
        <Trash size={12} />
        <span>This image was deleted</span>
      </div>
    );
  }

  return (
    <>
      <img
        src={message.mediaUrl}
        alt="Shared media"
        className="max-h-64 w-full object-cover rounded select-none cursor-pointer hover:opacity-95 transition-opacity"
        loading="lazy"
        onClick={() => onOpenLightbox(message.mediaUrl)}
      />
      <div className="px-1.5">
        <MessageMeta message={message} isSentByMe={isSentByMe} />
      </div>
    </>
  );
}

function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function VoiceBody({ message, isSentByMe }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  if (message.isDeleted) {
    return (
      <div className="flex items-center space-x-2 text-xs py-1 px-2 select-none italic opacity-75">
        <Trash size={12} />
        <span>This message was deleted</span>
      </div>
    );
  }

  const handlePlayPause = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const toggleSpeed = () => {
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    audioRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  return (
    <>
      <div className="flex items-center space-x-3.5 min-w-[240px]">
        <audio ref={audioRef} src={message.mediaUrl} preload="metadata" />
        <button
          type="button"
          onClick={handlePlayPause}
          className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 transition-colors focus:outline-none ${
            isSentByMe
              ? "bg-blue-700 text-white hover:bg-blue-800"
              : "bg-primary text-primary-foreground hover:bg-primary-hover"
          }`}
          aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>
        <div className="flex-grow flex flex-col space-y-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Seek voice note"
            className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${
              isSentByMe ? "bg-blue-300 accent-blue-700" : "bg-gray-300 accent-primary"
            }`}
          />
          <div className={`flex items-center justify-between text-[9px] font-semibold tracking-wider ${metaTextClass(isSentByMe)}`}>
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <span className="flex items-center space-x-1">
              <Volume2 size={10} />
              <span>Voice Message</span>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleSpeed}
          className={`rounded-full px-2 py-0.5 text-[9px] font-black shrink-0 uppercase tracking-widest focus:outline-none transition-all ${
            isSentByMe
              ? "bg-blue-1000/15 text-blue-1000 hover:bg-blue-1000/25"
              : "bg-gray-200 text-foreground-secondary hover:bg-surface-active"
          }`}
        >
          {playbackRate}x
        </button>
      </div>
      <MessageMeta message={message} isSentByMe={isSentByMe} />
    </>
  );
}

function TypingIndicator({ userName }) {
  return (
    <div className="flex justify-start mt-2 animate-pulse">
      <div className="bg-gray-100 text-foreground border border-border rounded-md rounded-tl-none px-4 py-2.5 shadow-card text-xs flex items-center space-x-1.5 font-outfit">
        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider font-outfit pr-0.5">
          {userName} is typing
        </span>
        <div className="flex items-center space-x-1 h-3">
          {[0, 0.15, 0.3].map((delay) => (
            <motion.div
              key={delay}
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay }}
              className="w-1.5 h-1.5 rounded-full bg-foreground-muted"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DateSeparator({ date }) {
  return (
    <div className="flex justify-center my-4 select-none">
      <span className="rounded-full bg-background/85 backdrop-blur border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground-muted font-outfit shadow-card">
        {formatDateSeparator(date)}
      </span>
    </div>
  );
}

function UnreadDivider() {
  return (
    <div className="flex items-center gap-3 my-3 select-none">
      <div className="flex-grow h-px bg-border" />
      <span className="text-[9px] font-black uppercase tracking-widest text-accent font-outfit">
        New messages
      </span>
      <div className="flex-grow h-px bg-border" />
    </div>
  );
}

function PinnedBanner({ pinnedMessage, onScrollToMessage, onTogglePin }) {
  const snippet = PINNED_LABELS[pinnedMessage.messageType] || pinnedMessage.content;

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-2.5 bg-background/95 backdrop-blur border-b border-border px-4 py-2 shadow-card select-none">
      <Pin size={13} className="text-accent shrink-0" />
      <button
        type="button"
        onClick={() => onScrollToMessage(pinnedMessage._id)}
        className="min-w-0 flex-grow text-left"
      >
        <span className="block text-[9px] font-black uppercase tracking-widest text-foreground-muted font-outfit">
          Pinned message
        </span>
        <span className="block text-xs font-medium text-foreground truncate">
          {snippet}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onTogglePin(pinnedMessage._id, false)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors focus:outline-none"
        aria-label="Unpin message"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function MessageList({
  messages,
  isLoadingMessages,
  activeChatUser,
  authUser,
  isTypingUser,
  activeHighlightedMessageId,
  reactions,
  activeReactionPickerMessageId,
  onToggleReactionPicker,
  onAddReaction,
  onOpenLightbox,
  onRespondToDate,
  onRespondToGame,
  onReply,
  onForward,
  onTogglePin,
  onScrollToMessage,
  messagesEndRef,
}) {
  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const deleteMessage = useMessageStore((state) => state.deleteMessage);
  const setEditingMessage = useMessageStore((state) => state.setEditingMessage);

  const handleStartEdit = (messageId) => {
    const msg = messages.find((m) => m._id === messageId);
    if (msg) setEditingMessage(msg);
  };

  const handleDeleteMessage = (messageId, deleteForEveryone) =>
    deleteMessage(messageId, deleteForEveryone);

  const handleToggleMenu = (messageId) => {
    setActiveMenuMessageId(messageId);
    if (messageId && onToggleReactionPicker) onToggleReactionPicker(null);
  };

  const handleToggleReactionPicker = (messageId) => {
    if (onToggleReactionPicker) onToggleReactionPicker(messageId);
    if (messageId) setActiveMenuMessageId(null);
  };

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 320);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const decorated = useMemo(() => decorateMessages(messages), [messages]);

  const pinnedMessage = useMemo(() => {
    const pinned = messages.filter((m) => m.isPinned && !m.isDeleted);
    return pinned.length > 0 ? pinned[pinned.length - 1] : null;
  }, [messages]);

  const firstUnreadId = useMemo(() => {
    const unread = messages.find((m) => {
      const sender = m.sender?._id || m.sender;
      return !m.read && sender === activeChatUser?._id;
    });
    return unread ? unread._id : null;
  }, [messages, activeChatUser]);

  const sharedHandlers = {
    activeReactionPickerMessageId,
    onToggleReactionPicker: handleToggleReactionPicker,
    onAddReaction,
    activeMenuMessageId,
    onToggleMenu: handleToggleMenu,
    onReply,
    onForward,
    onTogglePin,
    onScrollToMessage,
  };

  const renderMessage = (message, isFirstOfGroup) => {
    const isSentByMe =
      message.sender === authUser?._id || message.sender?._id === authUser?._id;
    const isHighlighted = message._id === activeHighlightedMessageId;

    if (message.messageType === "audio" || message.messageType === "video") {
      return <CallLogBubble message={message} isSentByMe={isSentByMe} />;
    }

    if (message.messageType === "date_proposal") {
      return (
        <DateProposalCard
          message={message}
          isSentByMe={isSentByMe}
          activeChatUserName={activeChatUser.name}
          isHighlighted={isHighlighted}
          onRespond={onRespondToDate}
        />
      );
    }

    if (message.messageType === "game_ttal") {
      return (
        <TwoTruthsLieCard
          message={message}
          isSentByMe={isSentByMe}
          isHighlighted={isHighlighted}
          activeChatUserName={activeChatUser.name}
          onRespond={onRespondToGame}
        />
      );
    }

    if (message.messageType === "image") {
      return (
        <MessageShell
          message={message}
          isSentByMe={isSentByMe}
          isHighlighted={isHighlighted}
          reaction={reactions[message._id]}
          bubbleClassName={getBubbleClass("image", isSentByMe, isFirstOfGroup)}
          showTail={isFirstOfGroup}
          triggerTitle="React to photo"
          onStartEdit={null}
          onDeleteMessage={handleDeleteMessage}
          {...sharedHandlers}
        >
          <ImageBody
            message={message}
            isSentByMe={isSentByMe}
            onOpenLightbox={onOpenLightbox}
          />
        </MessageShell>
      );
    }

    if (message.messageType === "voice_note") {
      return (
        <MessageShell
          message={message}
          isSentByMe={isSentByMe}
          isHighlighted={isHighlighted}
          reaction={reactions[message._id]}
          bubbleClassName={getBubbleClass("voice_note", isSentByMe, isFirstOfGroup)}
          showTail={isFirstOfGroup}
          triggerTitle="React to voice message"
          onStartEdit={null}
          onDeleteMessage={handleDeleteMessage}
          {...sharedHandlers}
        >
          <VoiceBody message={message} isSentByMe={isSentByMe} />
        </MessageShell>
      );
    }

    const emojiOnly = !message.isDeleted && isEmojiOnly(message.content);
    const bubbleClassName = emojiOnly
      ? "max-w-[70%] px-1 py-0.5"
      : getBubbleClass("text", isSentByMe, isFirstOfGroup);

    return (
      <MessageShell
        message={message}
        isSentByMe={isSentByMe}
        isHighlighted={isHighlighted}
        reaction={reactions[message._id]}
        bubbleClassName={bubbleClassName}
        showTail={!emojiOnly && isFirstOfGroup}
        triggerTitle="React to message"
        onStartEdit={handleStartEdit}
        onDeleteMessage={handleDeleteMessage}
        {...sharedHandlers}
      >
        <TextBody message={message} isSentByMe={isSentByMe} />
      </MessageShell>
    );
  };

  return (
    <div className="relative flex-grow overflow-hidden flex flex-col">
      {pinnedMessage && (
        <PinnedBanner
          pinnedMessage={pinnedMessage}
          onScrollToMessage={onScrollToMessage}
          onTogglePin={onTogglePin}
        />
      )}

      <div
        onScroll={handleScroll}
        className={`flex-grow overflow-y-auto p-4 chat-wallpaper select-none ${
          pinnedMessage ? "pt-16" : ""
        }`}
      >
        {isLoadingMessages ? (
          <LoadingState message="Fetching conversations..." />
        ) : messages.length === 0 ? (
          <FallbackState
            icon={Heart}
            title="Say Hello!"
            description={`You matched with ${activeChatUser.name}. Break the ice and send a message!`}
          />
        ) : (
          decorated.map(({ message, showDateSeparator, isFirstOfGroup }) => {
            const isCard = CARD_TYPES.includes(message.messageType);
            const marginClass = isCard ? "" : isFirstOfGroup ? "mt-3" : "mt-0.5";
            return (
              <div key={message._id}>
                {showDateSeparator && <DateSeparator date={message.createdAt} />}
                {message._id === firstUnreadId && <UnreadDivider />}
                <div className={marginClass}>
                  {renderMessage(message, isFirstOfGroup)}
                </div>
              </div>
            );
          })
        )}

        {isTypingUser && <TypingIndicator userName={activeChatUser.name} />}

        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border text-foreground-secondary shadow-popover hover:bg-surface-hover transition-colors focus:outline-none"
          aria-label="Scroll to latest messages"
        >
          <ArrowDown size={18} />
        </motion.button>
      )}
    </div>
  );
}
