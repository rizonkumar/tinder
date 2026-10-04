import { useState, useMemo, useCallback } from "react";
import { MessageCircleHeart, Pin, X, ArrowDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMessageStore } from "../../../store/useMessageStore";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Spinner } from "../../../components/ui/Skeleton";
import { IconButton } from "../../../components/ui/IconButton";
import MessageShell from "./MessageShell";
import { TextBody, ImageBody, VoiceBody } from "./MessageBodies";
import CallLogBubble from "./CallLogBubble";
import TypingIndicator from "./TypingIndicator";
import DateProposalCard from "./DateProposalCard";
import TwoTruthsLieCard from "./TwoTruthsLieCard";
import { isEmojiOnly } from "../utils/isEmojiOnly";
import { getBubbleClass } from "../utils/chatBubbleStyles";
import { decorateMessages, formatDateSeparator } from "../utils/messageGrouping";
import { cn } from "../../../utils/cn";

const PINNED_LABELS = {
  image: "Photo",
  voice_note: "Voice message",
  date_proposal: "Date proposal",
  game_ttal: "Two truths and a lie",
};

const CARD_TYPES = ["date_proposal", "game_ttal", "audio", "video"];
const SCROLL_BUTTON_THRESHOLD = 320;

function DateSeparator({ date }) {
  return (
    <div className="my-5 flex items-center gap-3" role="separator">
      <span className="h-px flex-1 bg-border" />
      <span className="label-12 text-foreground-muted">{formatDateSeparator(date)}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function UnreadDivider() {
  return (
    <div className="my-4 flex items-center gap-3" role="separator">
      <span className="h-px flex-1 bg-accent/40" />
      <span className="label-12 text-accent">New messages</span>
      <span className="h-px flex-1 bg-accent/40" />
    </div>
  );
}

function PinnedBanner({ pinnedMessage, onScrollToMessage, onTogglePin }) {
  const snippet = PINNED_LABELS[pinnedMessage.messageType] || pinnedMessage.content;
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-border bg-surface px-3 py-1.5 sm:px-4">
      <Pin size={14} className="shrink-0 text-foreground-muted" aria-hidden="true" />
      <button
        type="button"
        onClick={() => onScrollToMessage(pinnedMessage._id)}
        className="min-w-0 flex-1 rounded-md px-1 py-1 text-left transition-colors hover:bg-surface-hover focus-ring"
      >
        <span className="block text-xs text-foreground-muted">Pinned</span>
        <span className="block truncate text-[0.8125rem] text-foreground">{snippet}</span>
      </button>
      <IconButton label="Unpin message" size="sm" onClick={() => onTogglePin(pinnedMessage._id, false)}>
        <X />
      </IconButton>
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
    const target = messages.find((item) => item._id === messageId);
    if (target) setEditingMessage(target);
  };

  const handleToggleMenu = (messageId) => {
    setActiveMenuMessageId(messageId);
    if (messageId) onToggleReactionPicker?.(null);
  };

  const handleToggleReactionPicker = (messageId) => {
    onToggleReactionPicker?.(messageId);
    if (messageId) setActiveMenuMessageId(null);
  };

  const handleScroll = useCallback((event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > SCROLL_BUTTON_THRESHOLD);
  }, []);

  const decorated = useMemo(() => decorateMessages(messages), [messages]);

  const pinnedMessage = useMemo(() => {
    const pinned = messages.filter((item) => item.isPinned && !item.isDeleted);
    return pinned.length > 0 ? pinned[pinned.length - 1] : null;
  }, [messages]);

  const firstUnreadId = useMemo(() => {
    const unread = messages.find((item) => {
      const sender = item.sender?._id || item.sender;
      return !item.read && sender === activeChatUser?._id;
    });
    return unread ? unread._id : null;
  }, [messages, activeChatUser]);

  const shellProps = {
    activeReactionPickerMessageId,
    onToggleReactionPicker: handleToggleReactionPicker,
    onAddReaction,
    activeMenuMessageId,
    onToggleMenu: handleToggleMenu,
    onReply,
    onForward,
    onTogglePin,
    onScrollToMessage,
    onDeleteMessage: deleteMessage,
    currentUserId: authUser?._id,
  };

  const renderMessage = (message, isFirstOfGroup) => {
    const isSentByMe = message.sender === authUser?._id || message.sender?._id === authUser?._id;
    const isHighlighted = message._id === activeHighlightedMessageId;
    const common = { message, isSentByMe, isHighlighted, reaction: reactions[message._id], ...shellProps };

    switch (message.messageType) {
      case "audio":
      case "video":
        return <CallLogBubble message={message} isSentByMe={isSentByMe} />;
      case "date_proposal":
        return (
          <DateProposalCard
            message={message}
            isSentByMe={isSentByMe}
            activeChatUserName={activeChatUser.name}
            isHighlighted={isHighlighted}
            onRespond={onRespondToDate}
          />
        );
      case "game_ttal":
        return (
          <TwoTruthsLieCard
            message={message}
            isSentByMe={isSentByMe}
            isHighlighted={isHighlighted}
            activeChatUserName={activeChatUser.name}
            onRespond={onRespondToGame}
          />
        );
      case "image":
        return (
          <MessageShell {...common} bubbleClassName={getBubbleClass("image", isSentByMe, isFirstOfGroup)} onStartEdit={null}>
            <ImageBody message={message} isSentByMe={isSentByMe} onOpenLightbox={onOpenLightbox} />
          </MessageShell>
        );
      case "voice_note":
        return (
          <MessageShell {...common} bubbleClassName={getBubbleClass("voice_note", isSentByMe, isFirstOfGroup)} onStartEdit={null}>
            <VoiceBody message={message} isSentByMe={isSentByMe} />
          </MessageShell>
        );
      default: {
        const emojiOnly = !message.isDeleted && isEmojiOnly(message.content);
        return (
          <MessageShell
            {...common}
            bubbleClassName={emojiOnly ? "max-w-[70%] px-1" : getBubbleClass("text", isSentByMe, isFirstOfGroup)}
            onStartEdit={handleStartEdit}
          >
            <TextBody message={message} isSentByMe={isSentByMe} />
          </MessageShell>
        );
      }
    }
  };

  const renderContent = () => {
    if (isLoadingMessages) {
      return (
        <div className="flex h-full items-center justify-center">
          <Spinner label="Loading messages" />
        </div>
      );
    }
    if (messages.length === 0) {
      return (
        <div className="flex h-full items-center justify-center">
          <EmptyState
            icon={MessageCircleHeart}
            title={`You matched with ${activeChatUser.name}`}
            description="Say hi, ask about something on their profile, or use the wingman for an opener."
          />
        </div>
      );
    }
    return decorated.map(({ message, showDateSeparator, isFirstOfGroup }) => {
      const isCard = CARD_TYPES.includes(message.messageType);
      return (
        <div key={message._id}>
          {showDateSeparator && <DateSeparator date={message.createdAt} />}
          {message._id === firstUnreadId && <UnreadDivider />}
          <div className={cn(!isCard && (isFirstOfGroup ? "mt-3" : "mt-1"))}>{renderMessage(message, isFirstOfGroup)}</div>
        </div>
      );
    });
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {pinnedMessage && (
        <PinnedBanner pinnedMessage={pinnedMessage} onScrollToMessage={onScrollToMessage} onTogglePin={onTogglePin} />
      )}

      <div
        onScroll={handleScroll}
        className="chat-wallpaper min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6"
        role="log"
        aria-live="polite"
        aria-label={`Conversation with ${activeChatUser.name}`}
      >
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
          {renderContent()}
          {isTypingUser && <TypingIndicator userName={activeChatUser.name} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-4 right-4 z-20"
          >
            <IconButton
              label="Jump to latest message"
              variant="outline"
              className="rounded-full shadow-popover"
              onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <ArrowDown />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
