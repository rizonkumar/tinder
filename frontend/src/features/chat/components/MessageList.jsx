import { useState, useRef, useEffect } from "react";
import {
  Heart,
  Video,
  Phone,
  Calendar,
  Clock,
  MapPin,
  X,
  Smile,
  ChevronDown,
  Edit3,
  Trash,
  Trash2,
  Play,
  Pause,
  Volume2,
  CheckCheck,
  Reply,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessageStore } from "../../../store/useMessageStore";
import {
  ACTIVITY_OPTIONS,
  DEFAULT_ACTIVITY,
  EMOJI_REACTIONS,
} from "../../../constants";
import LoadingState from "../../../components/common/LoadingState";
import FallbackState from "../../../components/common/FallbackState";
import confetti from "canvas-confetti";

function CallLogBubble({ message }) {
  const isMissed = message.content.toLowerCase().includes("missed");
  const CallIcon = message.messageType === "video" ? Video : Phone;

  return (
    <div className="flex justify-center my-2">
      <div className="flex items-center space-x-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 shadow-sm">
        <CallIcon
          size={13}
          className={isMissed ? "text-red-500 animate-pulse" : "text-green-500"}
        />
        <span className="font-outfit">{message.content}</span>
        <span className="text-[9px] text-slate-400 dark:text-slate-550 font-medium ml-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function DateProposalCard({
  message,
  isSentByMe,
  activeChatUser,
  isHighlighted,
  onRespond,
}) {
  const info = message.dateInfo || {};
  const act = ACTIVITY_OPTIONS[info.activity] || DEFAULT_ACTIVITY;
  const IconComponent = act.icon || Calendar;

  const handleRespond = (status) => {
    onRespond(message._id, status);
    if (status === "accepted") {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

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
        className={`w-full max-w-[310px] rounded-2xl p-5 shadow-sm border relative overflow-hidden transition-all duration-205 ${
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
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-550 font-outfit">
            Date Proposal
          </span>
          {isAccepted && (
            <span className="flex items-center space-x-1.5 rounded-full bg-emerald-50 dark:bg-emerald-955/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Confirmed</span>
            </span>
          )}
          {isDeclined && (
            <span className="flex items-center space-x-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-zinc-650" />
              <span>Declined</span>
            </span>
          )}
          {isPending && (
            <span className="flex items-center space-x-1.5 rounded-full bg-amber-50 dark:bg-amber-955/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
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
            <p className="text-[9px] text-slate-400 dark:text-zinc-550 truncate font-bold font-outfit uppercase tracking-wider">
              Suggested by {isSentByMe ? "You" : activeChatUser.name}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-300 font-medium font-sans mb-4 border-t border-b border-slate-100 dark:border-zinc-800 py-3 mt-1 select-none">
          <div className="flex items-center space-x-2.5">
            <Calendar
              size={13}
              className="text-slate-400 dark:text-zinc-550 shrink-0"
            />
            <span className="truncate">{info.date}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Clock
              size={13}
              className="text-slate-400 dark:text-zinc-550 shrink-0"
            />
            <span className="truncate">{info.time}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <MapPin
              size={13}
              className="text-slate-400 dark:text-zinc-555 shrink-0"
            />
            <span className="truncate font-semibold">
              {info.location || "To be decided"}
            </span>
          </div>
        </div>

        {isPending && (
          <div className="w-full mt-2">
            {isSentByMe ? (
              <div className="flex items-center justify-center space-x-2 text-center text-[10px] text-slate-400 dark:text-zinc-550 bg-slate-50 dark:bg-zinc-800/50 rounded-xl py-2.5 font-outfit font-semibold tracking-wide">
                <Clock size={12} />
                <span>Awaiting {activeChatUser.name}'s reply</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5 w-full">
                <button
                  type="button"
                  onClick={() => handleRespond("declined")}
                  className="flex-1 py-2 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-700 transition-colors font-outfit focus:outline-none flex items-center justify-center space-x-1.5 uppercase tracking-wider"
                >
                  <X size={12} />
                  <span>Decline</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRespond("accepted")}
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

function ReactionPicker({
  messageId,
  isSentByMe,
  activeReactionPickerMessageId,
  onAddReaction,
  onToggleReactionPicker,
}) {
  return (
    <AnimatePresence>
      {activeReactionPickerMessageId === messageId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className={`absolute -top-11 ${
            isSentByMe ? "right-0" : "left-0"
          } z-30 flex items-center space-x-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-lg border border-slate-200/60 dark:border-zinc-800 select-none`}
        >
          {EMOJI_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onAddReaction(messageId, emoji)}
              className="hover:scale-130 active:scale-95 transition-transform duration-200 text-sm leading-none"
            >
              {emoji}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ReactionPill({ messageId, reaction, isSentByMe, onRemoveReaction }) {
  if (!reaction) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={() => onRemoveReaction(messageId)}
      className={`absolute -bottom-2.5 ${
        isSentByMe ? "left-3" : "right-3"
      } bg-white dark:bg-zinc-800 border border-slate-150 dark:border-zinc-700/60 rounded-full px-1.5 py-0.5 shadow-sm text-[11px] leading-none flex items-center select-none cursor-pointer border-pink-100 dark:border-pink-900/20 hover:scale-110 active:scale-95 transition-all`}
      title="Click to remove reaction"
    >
      {reaction}
    </motion.div>
  );
}

function ReactionTriggerButton({
  messageId,
  activeReactionPickerMessageId,
  onToggleReactionPicker,
  title,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onToggleReactionPicker(
          activeReactionPickerMessageId === messageId ? null : messageId,
        )
      }
      className="p-1 text-slate-400 hover:text-pink-500 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-all focus:outline-none"
      title={title}
    >
      <Smile size={14} />
    </button>
  );
}

function MessageActionsMenu({
  message,
  isSentByMe,
  onEdit,
  onDelete,
  onClose,
  onToggleReactionPicker,
}) {
  const menuRef = useRef(null);
  const [renderUpwards, setRenderUpwards] = useState(false);

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.bottom > viewportHeight - 120 || rect.top > viewportHeight * 0.6) {
        setRenderUpwards(true);
      }
    }
  }, []);

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 bg-white/95 dark:bg-zinc-900/95 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl p-1.5 min-w-[155px] flex flex-col space-y-0.5 backdrop-blur-md transition-all duration-200 ${
        renderUpwards ? "bottom-full mb-2" : "top-full mt-2"
      } ${isSentByMe ? "right-0" : "left-0"}`}
    >
      <button
        type="button"
        onClick={() => {
          onClose();
        }}
        className="flex items-center justify-between w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 text-left transition-colors"
      >
        <span className="flex items-center space-x-2">
          <Reply size={13} className="text-slate-400 dark:text-zinc-400" />
          <span>Reply</span>
        </span>
      </button>

      {onToggleReactionPicker && (
        <button
          type="button"
          onClick={() => {
            onToggleReactionPicker(message._id);
            onClose();
          }}
          className="flex items-center justify-between w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 text-left transition-colors"
        >
          <span className="flex items-center space-x-2">
            <Smile size={13} className="text-slate-400 dark:text-zinc-400" />
            <span>React</span>
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(message.content || "");
          onClose();
        }}
        className="flex items-center justify-between w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 text-left transition-colors"
      >
        <span className="flex items-center space-x-2">
          <Copy size={13} className="text-slate-400 dark:text-zinc-400" />
          <span>Copy Text</span>
        </span>
      </button>

      {isSentByMe && !message.isDeleted && onEdit && (
        <>
          <div className="border-t border-slate-100 dark:border-zinc-850 my-0.5" />
          <button
            type="button"
            onClick={() => {
              onEdit(message._id, message.content);
              onClose();
            }}
            className="flex items-center justify-between w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 text-left transition-colors"
          >
            <span className="flex items-center space-x-2">
              <Edit3 size={13} className="text-slate-400 dark:text-zinc-400" />
              <span>Edit Message</span>
            </span>
          </button>
        </>
      )}

      <div className="border-t border-slate-100 dark:border-zinc-850 my-0.5" />

      {isSentByMe && !message.isDeleted && (
        <button
          type="button"
          onClick={() => {
            onDelete(message._id, true);
            onClose();
          }}
          className="flex items-center justify-between w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 text-left transition-colors"
        >
          <span className="flex items-center space-x-2">
            <Trash2 size={13} className="text-red-500 dark:text-red-400" />
            <span>Delete for All</span>
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          onDelete(message._id, false);
          onClose();
        }}
        className="flex items-center justify-between w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 text-left transition-colors"
      >
        <span className="flex items-center space-x-2">
          <Trash size={13} className="text-slate-400 dark:text-zinc-400" />
          <span>Delete for Me</span>
        </span>
      </button>
    </div>
  );
}

function ReadReceipt({ read }) {
  if (read) {
    return <CheckCheck size={13} className="text-pink-500 stroke-[2.5]" />;
  }
  return (
    <CheckCheck
      size={13}
      className="text-slate-350 dark:text-zinc-650 stroke-[1.8]"
    />
  );
}

function VoiceNoteBubble({
  message,
  isSentByMe,
  isHighlighted,
  reaction,
  activeReactionPickerMessageId,
  onToggleReactionPicker,
  onAddReaction,
  activeMenuMessageId,
  onToggleMenu,
  onStartEdit,
  onDeleteMessage,
}) {
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

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
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

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      id={`msg-${message._id}`}
      className={`flex w-full ${
        isSentByMe ? "justify-end" : "justify-start"
      } my-2.5 relative group items-center`}
    >
      {!isSentByMe && (
        <div className="order-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 select-none shrink-0 flex items-center space-x-1">
          <ReactionTriggerButton
            messageId={message._id}
            activeReactionPickerMessageId={activeReactionPickerMessageId}
            onToggleReactionPicker={onToggleReactionPicker}
            title="React to voice message"
          />
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-2xl p-3 shadow-sm border relative transition-all duration-300 ${
          isSentByMe
            ? "bg-pink-500 text-white border-pink-500 rounded-tr-none order-1"
            : "bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border-slate-200/40 dark:border-zinc-800/80 rounded-tl-none order-1"
        } ${
          isHighlighted
            ? "ring-4 ring-pink-500/40 shadow-lg shadow-pink-500/30 scale-[1.02]"
            : ""
        }`}
      >
        {!message.isDeleted && (
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
            <button
              type="button"
              onClick={() =>
                onToggleMenu(
                  activeMenuMessageId === message._id ? null : message._id,
                )
              }
              className={`p-0.5 rounded-full backdrop-blur-sm shadow-sm transition-all focus:outline-none ${
                isSentByMe
                  ? "bg-pink-650/40 text-pink-100 hover:bg-pink-650/60 hover:text-white"
                  : "bg-slate-100/65 dark:bg-zinc-800/65 text-slate-400 dark:text-zinc-500 hover:bg-slate-200/80 dark:hover:bg-zinc-700/80 hover:text-slate-600 dark:hover:text-zinc-350"
              }`}
            >
              <ChevronDown size={13} />
            </button>
            {activeMenuMessageId === message._id && (
              <MessageActionsMenu
                message={message}
                isSentByMe={isSentByMe}
                onEdit={onStartEdit}
                onDelete={onDeleteMessage}
                onClose={() => onToggleMenu(null)}
                onToggleReactionPicker={onToggleReactionPicker}
              />
            )}
          </div>
        )}

        {message.isDeleted ? (
          <div className="flex items-center space-x-2 text-xs py-1 px-2 select-none italic opacity-75">
            <Trash size={12} />
            <span>This message was deleted</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3.5 min-w-[240px]">
            <audio ref={audioRef} src={message.mediaUrl} preload="metadata" />
            <button
              type="button"
              onClick={handlePlayPause}
              className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${
                isSentByMe
                  ? "bg-white text-pink-500 hover:bg-slate-50"
                  : "bg-pink-500 text-white hover:bg-pink-600"
              } transition-colors focus:outline-none`}
            >
              {isPlaying ? (
                <Pause size={15} />
              ) : (
                <Play size={15} className="ml-0.5" />
              )}
            </button>
            <div className="flex-grow flex flex-col space-y-1">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-current ${
                  isSentByMe
                    ? "bg-pink-300 accent-white"
                    : "bg-slate-200 dark:bg-zinc-800 accent-pink-500"
                }`}
              />
              <div
                className={`flex items-center justify-between text-[9px] font-semibold tracking-wider ${
                  isSentByMe ? "text-pink-100" : "text-slate-400"
                }`}
              >
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
                  ? "bg-white/25 text-white hover:bg-white/35"
                  : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
              }`}
            >
              {playbackRate}x
            </button>
          </div>
        )}

        <div className="flex items-center justify-end space-x-1 mt-1.5 pr-1 select-none">
          <span
            className={`block text-[9px] font-medium font-sans ${
              isSentByMe
                ? "text-pink-100"
                : "text-slate-400 dark:text-slate-555"
            }`}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isSentByMe && <ReadReceipt read={message.read} />}
        </div>

        <ReactionPill
          messageId={message._id}
          reaction={reaction}
          isSentByMe={isSentByMe}
          onRemoveReaction={() => onAddReaction(message._id, null)}
        />

        <ReactionPicker
          messageId={message._id}
          isSentByMe={isSentByMe}
          activeReactionPickerMessageId={activeReactionPickerMessageId}
          onAddReaction={onAddReaction}
          onClose={onToggleReactionPicker}
        />
      </div>

      {isSentByMe && (
        <div className="order-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2 select-none shrink-0 flex items-center space-x-1">
          <ReactionTriggerButton
            messageId={message._id}
            activeReactionPickerMessageId={activeReactionPickerMessageId}
            onToggleReactionPicker={onToggleReactionPicker}
            title="React to voice message"
          />
        </div>
      )}
    </div>
  );
}

function ImageBubble({
  message,
  isSentByMe,
  isHighlighted,
  reaction,
  activeReactionPickerMessageId,
  onToggleReactionPicker,
  onAddReaction,
  onOpenLightbox,
  activeMenuMessageId,
  onToggleMenu,
  onDeleteMessage,
}) {
  return (
    <div
      id={`msg-${message._id}`}
      className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-2.5 relative group items-center`}
    >
      {!isSentByMe && (
        <div className="order-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 select-none shrink-0">
          <ReactionTriggerButton
            messageId={message._id}
            activeReactionPickerMessageId={activeReactionPickerMessageId}
            onToggleReactionPicker={onToggleReactionPicker}
            title="React to photo"
          />
        </div>
      )}

      <div
        className={`max-w-[65%] rounded-2xl overflow-hidden shadow-sm border relative transition-all duration-300 ${
          isSentByMe
            ? "bg-pink-500 p-1 rounded-tr-none order-1"
            : "bg-white dark:bg-zinc-900 p-1 rounded-tl-none order-1 border-slate-200/30 dark:border-zinc-800/50"
        } ${
          isHighlighted
            ? "ring-4 ring-pink-500/40 shadow-lg shadow-pink-500/30 scale-[1.02]"
            : ""
        }`}
      >
        {!message.isDeleted && (
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
            <button
              type="button"
              onClick={() =>
                onToggleMenu(
                  activeMenuMessageId === message._id ? null : message._id,
                )
              }
              className={`p-0.5 rounded-full backdrop-blur-sm shadow-sm transition-all focus:outline-none ${
                isSentByMe
                  ? "bg-pink-650/40 text-pink-100 hover:bg-pink-650/60 hover:text-white"
                  : "bg-slate-100/65 dark:bg-zinc-800/65 text-slate-400 dark:text-zinc-550 hover:bg-slate-200/80 dark:hover:bg-zinc-700/80 hover:text-slate-600 dark:hover:text-zinc-300"
              }`}
            >
              <ChevronDown size={13} />
            </button>
            {activeMenuMessageId === message._id && (
              <MessageActionsMenu
                message={message}
                isSentByMe={isSentByMe}
                onEdit={null}
                onDelete={onDeleteMessage}
                onClose={() => onToggleMenu(null)}
                onToggleReactionPicker={onToggleReactionPicker}
              />
            )}
          </div>
        )}

        {message.isDeleted ? (
          <div className="flex items-center space-x-2 text-xs py-2.5 px-4 select-none italic opacity-75 text-slate-500">
            <Trash size={12} />
            <span>This image was deleted</span>
          </div>
        ) : (
          <img
            src={message.mediaUrl}
            alt="Shared media"
            className="max-h-64 w-full object-cover rounded-xl select-none cursor-pointer hover:opacity-95 transition-opacity"
            loading="lazy"
            onClick={() => onOpenLightbox(message.mediaUrl)}
          />
        )}

        <div className="flex items-center justify-end space-x-1 mt-1 pr-1.5 select-none">
          <span
            className={`block text-[9px] pr-1 text-right font-medium font-sans ${
              isSentByMe
                ? "text-pink-100"
                : "text-slate-400 dark:text-slate-550"
            }`}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isSentByMe && <ReadReceipt read={message.read} />}
        </div>

        {reaction && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => onAddReaction(message._id, null)}
            className={`absolute -bottom-1.5 ${
              isSentByMe ? "left-3" : "right-3"
            } bg-white dark:bg-zinc-800 border border-slate-150 dark:border-zinc-700/60 rounded-full px-1.5 py-0.5 shadow-sm text-[11px] leading-none flex items-center select-none cursor-pointer border-pink-100 dark:border-pink-900/20 hover:scale-110 active:scale-95 transition-all`}
            title="Click to remove reaction"
          >
            {reaction}
          </motion.div>
        )}

        <ReactionPicker
          messageId={message._id}
          isSentByMe={isSentByMe}
          activeReactionPickerMessageId={activeReactionPickerMessageId}
          onAddReaction={onAddReaction}
          onToggleReactionPicker={onToggleReactionPicker}
        />
      </div>

      {isSentByMe && (
        <div className="order-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2 select-none shrink-0">
          <ReactionTriggerButton
            messageId={message._id}
            activeReactionPickerMessageId={activeReactionPickerMessageId}
            onToggleReactionPicker={onToggleReactionPicker}
            title="React to photo"
          />
        </div>
      )}
    </div>
  );
}

function MessageBubble({
  message,
  isSentByMe,
  isHighlighted,
  reaction,
  activeReactionPickerMessageId,
  onToggleReactionPicker,
  onAddReaction,
  onStartEdit,
  activeMenuMessageId,
  onToggleMenu,
  onDeleteMessage,
}) {
  return (
    <div
      id={`msg-${message._id}`}
      className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-2 relative group items-center`}
    >
      {!isSentByMe && (
        <div className="order-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 select-none shrink-0 flex items-center space-x-1">
          <ReactionTriggerButton
            messageId={message._id}
            activeReactionPickerMessageId={activeReactionPickerMessageId}
            onToggleReactionPicker={onToggleReactionPicker}
            title="React to message"
          />
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed font-sans relative transition-all duration-305 ${
          isSentByMe
            ? "bg-pink-500 text-white rounded-tr-none order-1"
            : "bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200/45 dark:border-zinc-800/80 rounded-tl-none font-medium order-1"
        } ${
          isHighlighted
            ? "ring-4 ring-pink-500/40 shadow-lg shadow-pink-500/30 scale-[1.02] bg-pink-100 dark:bg-pink-955/20"
            : ""
        }`}
      >
        {!message.isDeleted && (
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
            <button
              type="button"
              onClick={() =>
                onToggleMenu(
                  activeMenuMessageId === message._id ? null : message._id,
                )
              }
              className={`p-0.5 rounded-full backdrop-blur-sm shadow-sm transition-all focus:outline-none ${
                isSentByMe
                  ? "bg-pink-650/40 text-pink-100 hover:bg-pink-650/60 hover:text-white"
                  : "bg-slate-100/65 dark:bg-zinc-800/65 text-slate-400 dark:text-zinc-550 hover:bg-slate-200/80 dark:hover:bg-zinc-700/80 hover:text-slate-600 dark:hover:text-zinc-300"
              }`}
            >
              <ChevronDown size={13} />
            </button>
            {activeMenuMessageId === message._id && (
              <MessageActionsMenu
                message={message}
                isSentByMe={isSentByMe}
                onEdit={onStartEdit}
                onDelete={onDeleteMessage}
                onClose={() => onToggleMenu(null)}
                onToggleReactionPicker={onToggleReactionPicker}
              />
            )}
          </div>
        )}

        <p className={message.isDeleted ? "italic opacity-70" : ""}>
          {message.content}
        </p>
        {message.isEdited && !message.isDeleted && (
          <span
            className={`block text-[8px] text-right font-medium font-sans ${isSentByMe ? "text-pink-100/60" : "text-slate-400"}`}
          >
            (edited)
          </span>
        )}

        <div className="flex items-center justify-end space-x-1 mt-1.5 pr-1 select-none">
          <span
            className={`block text-[9px] mt-0.5 text-right font-medium font-sans ${
              isSentByMe
                ? "text-pink-100"
                : "text-slate-400 dark:text-slate-550"
            }`}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isSentByMe && <ReadReceipt read={message.read} />}
        </div>

        <ReactionPill
          messageId={message._id}
          reaction={reaction}
          isSentByMe={isSentByMe}
          onRemoveReaction={() => onAddReaction(message._id, null)}
        />

        <ReactionPicker
          messageId={message._id}
          isSentByMe={isSentByMe}
          activeReactionPickerMessageId={activeReactionPickerMessageId}
          onAddReaction={onAddReaction}
          onClose={onToggleReactionPicker}
        />
      </div>

      {isSentByMe && (
        <div className="order-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2 select-none shrink-0 flex items-center space-x-1">
          <ReactionTriggerButton
            messageId={message._id}
            activeReactionPickerMessageId={activeReactionPickerMessageId}
            onToggleReactionPicker={onToggleReactionPicker}
            title="React to message"
          />
        </div>
      )}
    </div>
  );
}

function TypingIndicator({ userName }) {
  return (
    <div className="flex justify-start my-2 animate-pulse">
      <div className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200/40 dark:border-zinc-800/80 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm text-xs flex items-center space-x-1.5 font-outfit">
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-550 uppercase tracking-wider font-outfit pr-0.5">
          {userName} is typing
        </span>
        <div className="flex items-center space-x-1 h-3">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
            className="w-1.5 h-1.5 rounded-full bg-pink-500"
          />
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
            className="w-1.5 h-1.5 rounded-full bg-pink-500"
          />
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
            className="w-1.5 h-1.5 rounded-full bg-pink-500"
          />
        </div>
      </div>
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
  messagesEndRef,
}) {
  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null);

  const deleteMessage = useMessageStore((state) => state.deleteMessage);
  const setEditingMessage = useMessageStore((state) => state.setEditingMessage);

  const handleStartEdit = (messageId, content) => {
    const msg = messages.find((m) => m._id === messageId);
    if (msg) {
      setEditingMessage(msg);
    }
  };

  const handleDeleteMessage = async (messageId, deleteForEveryone) => {
    await deleteMessage(messageId, deleteForEveryone);
  };

  const handleToggleMenu = (messageId) => {
    setActiveMenuMessageId(messageId);
    if (messageId && onToggleReactionPicker) {
      onToggleReactionPicker(null);
    }
  };

  const handleToggleReactionPicker = (messageId) => {
    if (onToggleReactionPicker) {
      onToggleReactionPicker(messageId);
    }
    if (messageId) {
      setActiveMenuMessageId(null);
    }
  };

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4 chat-wallpaper select-none">
      {isLoadingMessages ? (
        <LoadingState message="Fetching conversations..." />
      ) : messages.length === 0 ? (
        <FallbackState
          icon={Heart}
          title="Say Hello!"
          description={`You matched with ${activeChatUser.name}. Break the ice and send a message!`}
        />
      ) : (
        messages.map((message) => {
          const isSentByMe =
            message.sender === authUser?._id ||
            message.sender?._id === authUser?._id;
          const isCallLog =
            message.messageType === "audio" || message.messageType === "video";

          if (isCallLog) {
            return <CallLogBubble key={message._id} message={message} />;
          }

          if (message.messageType === "date_proposal") {
            return (
              <DateProposalCard
                key={message._id}
                message={message}
                isSentByMe={isSentByMe}
                activeChatUser={activeChatUser}
                isHighlighted={message._id === activeHighlightedMessageId}
                onRespond={onRespondToDate}
              />
            );
          }

          if (message.messageType === "image") {
            return (
              <ImageBubble
                key={message._id}
                message={message}
                isSentByMe={isSentByMe}
                isHighlighted={message._id === activeHighlightedMessageId}
                reaction={reactions[message._id]}
                activeReactionPickerMessageId={activeReactionPickerMessageId}
                onToggleReactionPicker={handleToggleReactionPicker}
                onAddReaction={onAddReaction}
                onOpenLightbox={onOpenLightbox}
                activeMenuMessageId={activeMenuMessageId}
                onToggleMenu={handleToggleMenu}
                onDeleteMessage={handleDeleteMessage}
              />
            );
          }

          if (message.messageType === "voice_note") {
            return (
              <VoiceNoteBubble
                key={message._id}
                message={message}
                isSentByMe={isSentByMe}
                isHighlighted={message._id === activeHighlightedMessageId}
                reaction={reactions[message._id]}
                activeReactionPickerMessageId={activeReactionPickerMessageId}
                onToggleReactionPicker={handleToggleReactionPicker}
                onAddReaction={onAddReaction}
                activeMenuMessageId={activeMenuMessageId}
                onToggleMenu={handleToggleMenu}
                onDeleteMessage={handleDeleteMessage}
              />
            );
          }

          return (
            <MessageBubble
              key={message._id}
              message={message}
              isSentByMe={isSentByMe}
              isHighlighted={message._id === activeHighlightedMessageId}
              reaction={reactions[message._id]}
              activeReactionPickerMessageId={activeReactionPickerMessageId}
              onToggleReactionPicker={handleToggleReactionPicker}
              onAddReaction={onAddReaction}
              onStartEdit={handleStartEdit}
              activeMenuMessageId={activeMenuMessageId}
              onToggleMenu={handleToggleMenu}
              onDeleteMessage={handleDeleteMessage}
            />
          );
        })
      )}

      {isTypingUser && <TypingIndicator userName={activeChatUser.name} />}

      <div ref={messagesEndRef} />
    </div>
  );
}
