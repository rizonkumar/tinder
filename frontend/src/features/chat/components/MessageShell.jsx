import { Smile, MoreHorizontal, Forward, Image as ImageIcon, Mic, Calendar, Gamepad2 } from "lucide-react";
import ReactionPicker from "./ReactionPicker";
import ReactionPill from "./ReactionPill";
import MessageActionsMenu from "./MessageActionsMenu";
import { cn } from "../../../utils/cn";

const REPLY_TYPE_LABEL = {
  image: "Photo",
  voice_note: "Voice message",
  audio: "Call",
  video: "Video call",
  date_proposal: "Date proposal",
  game_ttal: "Two truths and a lie",
};

const REPLY_TYPE_ICON = {
  image: ImageIcon,
  voice_note: Mic,
  date_proposal: Calendar,
  game_ttal: Gamepad2,
};

const HOVER_REVEAL =
  "opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100";

function QuotedReply({ replyTo, currentUserId, onClick }) {
  const author = replyTo.senderId && replyTo.senderId === currentUserId ? "You" : replyTo.senderName || "Message";
  const label = REPLY_TYPE_LABEL[replyTo.messageType] || replyTo.content;
  const Icon = REPLY_TYPE_ICON[replyTo.messageType];
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-1.5 flex w-full items-stretch gap-2 overflow-hidden rounded-md border-l-2 border-accent bg-surface-hover py-1 pl-2 pr-2 text-left transition-colors hover:bg-surface-active focus-ring"
    >
      {replyTo.mediaUrl && replyTo.messageType === "image" && (
        <img src={replyTo.mediaUrl} alt="" className="size-8 shrink-0 rounded object-cover" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-accent">{author}</span>
        <span className="flex items-center gap-1 truncate text-xs text-foreground-secondary">
          {Icon && <Icon size={12} className="shrink-0" aria-hidden="true" />}
          <span className="truncate">{label}</span>
        </span>
      </span>
    </button>
  );
}

function ForwardedTag() {
  return (
    <span className="mb-1 flex items-center gap-1 text-xs text-foreground-muted">
      <Forward size={12} aria-hidden="true" />
      Forwarded
    </span>
  );
}

function SideActions({
  message,
  isSentByMe,
  isMenuOpen,
  onToggleMenu,
  onToggleReactionPicker,
  isReactionPickerOpen,
  menuProps,
}) {
  return (
    <div className={cn("relative flex shrink-0 items-center gap-0.5 self-center", isSentByMe ? "mr-1.5" : "ml-1.5", !isMenuOpen && HOVER_REVEAL)}>
      <button
        type="button"
        onClick={() => onToggleReactionPicker(isReactionPickerOpen ? null : message._id)}
        aria-label="Add reaction"
        className="flex size-7 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-ring"
      >
        <Smile size={15} />
      </button>
      <button
        type="button"
        onClick={() => onToggleMenu(isMenuOpen ? null : message._id)}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        className={cn(
          "flex size-7 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-ring",
          isMenuOpen && "bg-surface-active text-foreground"
        )}
      >
        <MoreHorizontal size={15} />
      </button>
      {isMenuOpen && (
        <MessageActionsMenu
          message={message}
          isSentByMe={isSentByMe}
          onClose={() => onToggleMenu(null)}
          onReact={onToggleReactionPicker}
          {...menuProps}
        />
      )}
    </div>
  );
}

export default function MessageShell({
  message,
  isSentByMe,
  isHighlighted,
  reaction,
  bubbleClassName,
  activeReactionPickerMessageId,
  onToggleReactionPicker,
  onAddReaction,
  activeMenuMessageId,
  onToggleMenu,
  onReply,
  onForward,
  onStartEdit,
  onDeleteMessage,
  onTogglePin,
  onScrollToMessage,
  currentUserId,
  children,
}) {
  const showActions = !message.isDeleted;
  const isMenuOpen = activeMenuMessageId === message._id;
  const isReactionPickerOpen = activeReactionPickerMessageId === message._id;

  const actions = showActions && (
    <SideActions
      message={message}
      isSentByMe={isSentByMe}
      isMenuOpen={isMenuOpen}
      onToggleMenu={onToggleMenu}
      onToggleReactionPicker={onToggleReactionPicker}
      isReactionPickerOpen={isReactionPickerOpen}
      menuProps={{ onReply, onForward, onEdit: onStartEdit, onDelete: onDeleteMessage, onTogglePin }}
    />
  );

  return (
    <div
      id={`msg-${message._id}`}
      className={cn("group flex w-full items-end", isSentByMe ? "justify-end" : "justify-start", reaction && "pb-3")}
    >
      {isSentByMe && actions}
      <div
        className={cn(
          "relative transition-shadow duration-300",
          bubbleClassName,
          isHighlighted && "ring-2 ring-ring ring-offset-2 ring-offset-background"
        )}
      >
        {message.isForwarded && !message.isDeleted && <ForwardedTag />}
        {message.replyTo && (
          <QuotedReply replyTo={message.replyTo} currentUserId={currentUserId} onClick={() => onScrollToMessage?.(message.replyTo.id)} />
        )}
        {children}
        <ReactionPill reaction={reaction} isSentByMe={isSentByMe} onRemove={() => onAddReaction(message._id, null)} />
        <ReactionPicker
          messageId={message._id}
          isSentByMe={isSentByMe}
          isOpen={isReactionPickerOpen}
          onAddReaction={onAddReaction}
        />
      </div>
      {!isSentByMe && actions}
    </div>
  );
}
