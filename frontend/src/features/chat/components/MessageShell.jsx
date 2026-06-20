import { useState, useRef, useEffect } from "react";
import {
  Smile,
  ChevronDown,
  Reply,
  Copy,
  Edit3,
  Pin,
  PinOff,
  Trash,
  Trash2,
  CheckCheck,
  Image as ImageIcon,
  Mic,
  Calendar,
  Gamepad2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EMOJI_REACTIONS } from "../../../constants";

export function ReadReceipt({ read }) {
  return (
    <CheckCheck
      size={13}
      className={read ? "text-accent stroke-[2.5]" : "text-foreground-muted stroke-[1.8]"}
    />
  );
}

export function MessageMeta({ message, isSentByMe, showReceipt = true }) {
  return (
    <div className="flex items-center justify-end space-x-1 mt-1.5 pr-0.5 select-none">
      <span
        className={`block text-[9px] font-medium font-sans ${
          isSentByMe ? "text-primary-foreground/80" : "text-foreground-muted"
        }`}
      >
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      {isSentByMe && showReceipt && <ReadReceipt read={message.read} />}
    </div>
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
          activeReactionPickerMessageId === messageId ? null : messageId
        )
      }
      className="p-1 text-foreground-muted hover:text-accent rounded-full hover:bg-surface-hover transition-all focus:outline-none"
      title={title}
      aria-label={title}
    >
      <Smile size={14} />
    </button>
  );
}

function ReactionPicker({
  messageId,
  isSentByMe,
  activeReactionPickerMessageId,
  onAddReaction,
}) {
  const pickerRef = useRef(null);
  const [renderDownwards, setRenderDownwards] = useState(false);

  useEffect(() => {
    if (pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      if (rect.top < 160) setRenderDownwards(true);
    }
  }, []);

  return (
    <AnimatePresence>
      {activeReactionPickerMessageId === messageId && (
        <motion.div
          ref={pickerRef}
          initial={{ opacity: 0, scale: 0.9, y: renderDownwards ? -10 : 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: renderDownwards ? -10 : 10 }}
          className={`absolute ${renderDownwards ? "top-full mt-2.5" : "-top-11"} ${
            isSentByMe ? "right-0" : "left-0"
          } z-30 flex items-center space-x-1.5 bg-background px-2.5 py-1.5 rounded-full shadow-popover border border-border select-none`}
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
      } bg-background border border-border rounded-full px-1.5 py-0.5 shadow-card text-[11px] leading-none flex items-center select-none cursor-pointer hover:scale-110 active:scale-95 transition-all`}
      title="Click to remove reaction"
    >
      {reaction}
    </motion.div>
  );
}

const REPLY_TYPE_LABEL = {
  image: "Photo",
  voice_note: "Voice message",
  audio: "Call",
  video: "Video call",
  date_proposal: "Date proposal",
  game_ttal: "Two Truths & a Lie",
};

const REPLY_TYPE_ICON = {
  image: ImageIcon,
  voice_note: Mic,
  date_proposal: Calendar,
  game_ttal: Gamepad2,
};

export function QuotedReply({ replyTo, isSentByMe, onClick }) {
  if (!replyTo) return null;

  const label = REPLY_TYPE_LABEL[replyTo.messageType] || replyTo.content;
  const Icon = REPLY_TYPE_ICON[replyTo.messageType];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-stretch gap-2 mb-2 overflow-hidden rounded-md border-l-2 pl-2 pr-2 py-1 text-left transition-colors ${
        isSentByMe
          ? "border-primary-foreground/60 bg-primary-foreground/10 hover:bg-primary-foreground/15"
          : "border-accent bg-surface-hover hover:bg-surface-active"
      }`}
    >
      {replyTo.mediaUrl && replyTo.messageType === "image" && (
        <img
          src={replyTo.mediaUrl}
          alt=""
          className="h-8 w-8 shrink-0 rounded object-cover"
        />
      )}
      <span className="min-w-0 flex-grow">
        <span
          className={`block text-[10px] font-bold truncate font-outfit ${
            isSentByMe ? "text-primary-foreground" : "text-accent"
          }`}
        >
          {replyTo.senderName || "Message"}
        </span>
        <span
          className={`flex items-center gap-1 text-[11px] truncate ${
            isSentByMe ? "text-primary-foreground/75" : "text-foreground-secondary"
          }`}
        >
          {Icon && <Icon size={11} className="shrink-0" />}
          <span className="truncate">{label}</span>
        </span>
      </span>
    </button>
  );
}

function MessageActionsMenu({
  message,
  isSentByMe,
  onReply,
  onEdit,
  onDelete,
  onTogglePin,
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

  const itemClass =
    "flex items-center w-full text-xs font-semibold px-2.5 py-1.5 rounded-sm text-foreground hover:bg-surface-hover text-left transition-colors space-x-2";

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 bg-background border border-border rounded-md shadow-popover p-1.5 min-w-[160px] flex flex-col space-y-0.5 transition-all duration-200 ${
        renderUpwards ? "bottom-full mb-2" : "top-full mt-2"
      } ${isSentByMe ? "right-0" : "left-0"}`}
    >
      <button
        type="button"
        onClick={() => {
          onReply(message);
          onClose();
        }}
        className={itemClass}
      >
        <Reply size={13} className="text-foreground-muted" />
        <span>Reply</span>
      </button>

      {onToggleReactionPicker && (
        <button
          type="button"
          onClick={() => {
            onToggleReactionPicker(message._id);
            onClose();
          }}
          className={itemClass}
        >
          <Smile size={13} className="text-foreground-muted" />
          <span>React</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          onTogglePin(message._id, !message.isPinned);
          onClose();
        }}
        className={itemClass}
      >
        {message.isPinned ? (
          <PinOff size={13} className="text-foreground-muted" />
        ) : (
          <Pin size={13} className="text-foreground-muted" />
        )}
        <span>{message.isPinned ? "Unpin" : "Pin"}</span>
      </button>

      {message.content && (
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(message.content || "");
            onClose();
          }}
          className={itemClass}
        >
          <Copy size={13} className="text-foreground-muted" />
          <span>Copy Text</span>
        </button>
      )}

      {isSentByMe && !message.isDeleted && onEdit && (
        <>
          <div className="border-t border-border my-0.5" />
          <button
            type="button"
            onClick={() => {
              onEdit(message._id, message.content);
              onClose();
            }}
            className={itemClass}
          >
            <Edit3 size={13} className="text-foreground-muted" />
            <span>Edit Message</span>
          </button>
        </>
      )}

      <div className="border-t border-border my-0.5" />

      {isSentByMe && !message.isDeleted && (
        <button
          type="button"
          onClick={() => {
            onDelete(message._id, true);
            onClose();
          }}
          className="flex items-center w-full text-xs font-semibold px-2.5 py-1.5 rounded-sm text-red-800 hover:bg-red-100 text-left transition-colors space-x-2"
        >
          <Trash2 size={13} className="text-red-800" />
          <span>Delete for All</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          onDelete(message._id, false);
          onClose();
        }}
        className={itemClass}
      >
        <Trash size={13} className="text-foreground-muted" />
        <span>Delete for Me</span>
      </button>
    </div>
  );
}

function MenuArea({
  message,
  isSentByMe,
  activeMenuMessageId,
  onToggleMenu,
  onReply,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleReactionPicker,
}) {
  return (
    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
      <button
        type="button"
        onClick={() =>
          onToggleMenu(activeMenuMessageId === message._id ? null : message._id)
        }
        className={`p-0.5 rounded-full shadow-card transition-all focus:outline-none ${
          isSentByMe
            ? "bg-primary-hover text-primary-foreground hover:bg-primary-hover"
            : "bg-surface-hover text-foreground-muted hover:bg-surface-active hover:text-foreground-secondary"
        }`}
        aria-label="Message actions"
      >
        <ChevronDown size={13} />
      </button>
      {activeMenuMessageId === message._id && (
        <MessageActionsMenu
          message={message}
          isSentByMe={isSentByMe}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          onClose={() => onToggleMenu(null)}
          onToggleReactionPicker={onToggleReactionPicker}
        />
      )}
    </div>
  );
}

function SideTrigger({
  className,
  messageId,
  activeReactionPickerMessageId,
  onToggleReactionPicker,
  triggerTitle,
}) {
  return (
    <div
      className={`${className} opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none shrink-0 flex items-center`}
    >
      <ReactionTriggerButton
        messageId={messageId}
        activeReactionPickerMessageId={activeReactionPickerMessageId}
        onToggleReactionPicker={onToggleReactionPicker}
        title={triggerTitle}
      />
    </div>
  );
}

export default function MessageShell({
  message,
  isSentByMe,
  isHighlighted,
  reaction,
  bubbleClassName,
  triggerTitle = "React to message",
  activeReactionPickerMessageId,
  onToggleReactionPicker,
  onAddReaction,
  activeMenuMessageId,
  onToggleMenu,
  onReply,
  onStartEdit,
  onDeleteMessage,
  onTogglePin,
  onScrollToMessage,
  children,
}) {
  const showChrome = !message.isDeleted;

  return (
    <div
      id={`msg-${message._id}`}
      className={`flex w-full ${
        isSentByMe ? "justify-end" : "justify-start"
      } my-2 relative group items-center`}
    >
      {!isSentByMe && showChrome && (
        <SideTrigger
          className="order-2 ml-2"
          messageId={message._id}
          activeReactionPickerMessageId={activeReactionPickerMessageId}
          onToggleReactionPicker={onToggleReactionPicker}
          triggerTitle={triggerTitle}
        />
      )}

      <div
        className={`order-1 relative transition-all duration-300 ${bubbleClassName} ${
          isHighlighted ? "ring-2 ring-ring shadow-card scale-[1.02]" : ""
        }`}
      >
        {showChrome && (
          <MenuArea
            message={message}
            isSentByMe={isSentByMe}
            activeMenuMessageId={activeMenuMessageId}
            onToggleMenu={onToggleMenu}
            onReply={onReply}
            onEdit={onStartEdit}
            onDelete={onDeleteMessage}
            onTogglePin={onTogglePin}
            onToggleReactionPicker={onToggleReactionPicker}
          />
        )}

        {message.replyTo && (
          <QuotedReply
            replyTo={message.replyTo}
            isSentByMe={isSentByMe}
            onClick={() => onScrollToMessage?.(message.replyTo.id)}
          />
        )}

        {children}

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
        />
      </div>

      {isSentByMe && showChrome && (
        <SideTrigger
          className="order-0 mr-2"
          messageId={message._id}
          activeReactionPickerMessageId={activeReactionPickerMessageId}
          onToggleReactionPicker={onToggleReactionPicker}
          triggerTitle={triggerTitle}
        />
      )}
    </div>
  );
}
