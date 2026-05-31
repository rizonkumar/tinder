import {
  Heart,
  Video,
  Phone,
  Calendar,
  Clock,
  MapPin,
  X,
  Smile,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ACTIVITY_OPTIONS, DEFAULT_ACTIVITY, EMOJI_REACTIONS } from "../../../constants";
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
          className={
            isMissed
              ? "text-red-500 animate-pulse"
              : "text-green-500"
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
              Suggested by {isSentByMe ? "You" : activeChatUser.name}
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
                <span>
                  Awaiting {activeChatUser.name}'s reply
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5 w-full">
                <button
                  onClick={() => handleRespond("declined")}
                  className="flex-1 py-2 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-700 transition-colors font-outfit focus:outline-none flex items-center justify-center space-x-1.5 uppercase tracking-wider"
                >
                  <X size={12} />
                  <span>Decline</span>
                </button>
                <button
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

function ReactionPicker({ messageId, isSentByMe, activeReactionPickerMessageId, onAddReaction, onToggleReactionPicker }) {
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

function ReactionTriggerButton({ messageId, activeReactionPickerMessageId, onToggleReactionPicker, title }) {
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

function ImageBubble({
  message,
  isSentByMe,
  isHighlighted,
  reaction,
  activeReactionPickerMessageId,
  onToggleReactionPicker,
  onAddReaction,
  onOpenLightbox,
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
        <img
          src={message.mediaUrl}
          alt="Shared media"
          className="max-h-64 w-full object-cover rounded-xl select-none cursor-pointer hover:opacity-95 transition-opacity"
          loading="lazy"
          onClick={() => onOpenLightbox(message.mediaUrl)}
        />
        <span
          className={`block text-[9px] mt-1 pr-1 text-right font-medium font-sans ${
            isSentByMe
              ? "text-pink-100"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

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
            ? "ring-4 ring-pink-500/40 shadow-lg shadow-pink-500/30 scale-[1.02] bg-pink-100 dark:bg-pink-950/20"
            : ""
        }`}
      >
        <p>{message.content}</p>
        <span
          className={`block text-[9px] mt-1.5 text-right font-medium font-sans ${
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
          onToggleReactionPicker={onToggleReactionPicker}
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
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-outfit pr-0.5">
          {userName} is typing
        </span>
        <div className="flex items-center space-x-1 h-3">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: 0,
            }}
            className="w-1.5 h-1.5 rounded-full bg-pink-500"
          />
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: 0.15,
            }}
            className="w-1.5 h-1.5 rounded-full bg-pink-500"
          />
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: 0.3,
            }}
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
  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-zinc-950/40 select-none">
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
            message.messageType === "audio" ||
            message.messageType === "video";

          if (isCallLog) {
            return (
              <CallLogBubble key={message._id} message={message} />
            );
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
                onToggleReactionPicker={onToggleReactionPicker}
                onAddReaction={onAddReaction}
                onOpenLightbox={onOpenLightbox}
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
              onToggleReactionPicker={onToggleReactionPicker}
              onAddReaction={onAddReaction}
            />
          );
        })
      )}

      {isTypingUser && (
        <TypingIndicator userName={activeChatUser.name} />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
