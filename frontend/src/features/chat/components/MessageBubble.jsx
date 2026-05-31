import { Smile } from "lucide-react";
import ReactionPill from "./ReactionPill";
import ReactionPicker from "./ReactionPicker";

export default function MessageBubble({
  message,
  isSentByMe,
  isHighlighted,
  reaction,
  isReactionPickerActive,
  onToggleReactionPicker,
  onAddReaction,
  onRemoveReaction,
}) {
  return (
    <div
      id={`msg-${message._id}`}
      className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-2 relative group items-center`}
    >
      {!isSentByMe && (
        <div className="order-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 select-none shrink-0 flex items-center space-x-1">
          <button
            type="button"
            onClick={onToggleReactionPicker}
            className="p-1 text-slate-400 hover:text-pink-500 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-all focus:outline-none"
            title="React to message"
          >
            <Smile size={14} />
          </button>
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
          emoji={reaction}
          isSentByMe={isSentByMe}
          onRemove={onRemoveReaction}
        />

        <ReactionPicker
          messageId={message._id}
          isSentByMe={isSentByMe}
          isActive={isReactionPickerActive}
          onReact={onAddReaction}
          onClose={onToggleReactionPicker}
        />
      </div>

      {isSentByMe && (
        <div className="order-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2 select-none shrink-0 flex items-center space-x-1">
          <button
            type="button"
            onClick={onToggleReactionPicker}
            className="p-1 text-slate-400 hover:text-pink-500 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-all focus:outline-none"
            title="React to message"
          >
            <Smile size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
