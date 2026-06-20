import { Smile } from "lucide-react";
import ReactionPill from "./ReactionPill";
import ReactionPicker from "./ReactionPicker";

export default function ImageBubble({
  message,
  isSentByMe,
  isHighlighted,
  reaction,
  isReactionPickerActive,
  onToggleReactionPicker,
  onAddReaction,
  onRemoveReaction,
  onOpenLightbox,
}) {
  return (
    <div
      id={`msg-${message._id}`}
      className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-2.5 relative group items-center`}
    >
      {!isSentByMe && (
        <div className="order-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 select-none shrink-0">
          <button
            type="button"
            onClick={onToggleReactionPicker}
            className="p-1 text-foreground-muted hover:text-accent rounded-full hover:bg-surface-hover transition-all focus:outline-none"
            title="React to photo"
          >
            <Smile size={14} />
          </button>
        </div>
      )}

      <div
        className={`max-w-[65%] rounded-2xl overflow-hidden shadow-card border relative transition-all duration-300 ${
          isSentByMe
            ? "bg-primary p-1 rounded-tr-none order-1 border-border"
            : "bg-background p-1 rounded-tl-none order-1 border-border"
        } ${
          isHighlighted
            ? "ring-2 ring-ring scale-[1.02]"
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
              ? "text-primary-foreground"
              : "text-foreground-muted"
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
          bottomOffset="-bottom-1.5"
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
        <div className="order-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2 select-none shrink-0">
          <button
            type="button"
            onClick={onToggleReactionPicker}
            className="p-1 text-foreground-muted hover:text-accent rounded-full hover:bg-surface-hover transition-all focus:outline-none"
            title="React to photo"
          >
            <Smile size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
