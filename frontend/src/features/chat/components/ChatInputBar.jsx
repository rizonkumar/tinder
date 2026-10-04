import { useState, useRef, useEffect } from "react";
import {
  Send,
  ImagePlus,
  Smile,
  CalendarHeart,
  Sparkles,
  Mic,
  X,
  Check,
  Gamepad2,
  Reply,
  Pencil,
  Timer,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessageStore } from "../../../store/useMessageStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { DISAPPEARING_OPTIONS } from "../../../constants";
import { IconButton } from "../../../components/ui/IconButton";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";

const REPLY_PREVIEW_LABELS = {
  image: "Photo",
  voice_note: "Voice message",
  date_proposal: "Date proposal",
  game_ttal: "Two truths and a lie",
};

function ComposerBanner({ icon: Icon, title, detail, onDismiss, dismissLabel }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-2.5 border-b border-border px-3 py-2">
        <Icon size={15} className="shrink-0 text-accent" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-accent">{title}</p>
          {detail && <p className="truncate text-xs text-foreground-secondary">{detail}</p>}
        </div>
        <IconButton label={dismissLabel} size="sm" onClick={onDismiss}>
          <X />
        </IconButton>
      </div>
    </motion.div>
  );
}

function ToolButton({ label, icon: Icon, onClick, active = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-md px-2 text-xs font-medium transition-colors focus-ring",
        active
          ? "bg-surface-active text-foreground"
          : "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
      )}
    >
      <Icon size={17} aria-hidden="true" />
      {children}
    </button>
  );
}

export default function ChatInputBar({
  text,
  onTextChange,
  onSend,
  onImageUpload,
  showGifPicker,
  onToggleGifPicker,
  showAIAssistant,
  onToggleAIAssistant,
  onOpenDateModal,
  onOpenGameModal,
  children,
}) {
  const fileInputRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const authUserId = useAuthStore((state) => state.authUser?._id);
  const editingMessage = useMessageStore((state) => state.editingMessage);
  const setEditingMessage = useMessageStore((state) => state.setEditingMessage);
  const replyingTo = useMessageStore((state) => state.replyingTo);
  const setReplyingTo = useMessageStore((state) => state.setReplyingTo);
  const disappearingDuration = useMessageStore((state) => state.disappearingDuration);
  const setDisappearingDuration = useMessageStore(
    (state) => state.setDisappearingDuration
  );

  const isDisappearing = disappearingDuration > 0;
  const activeDisappearingOption = DISAPPEARING_OPTIONS.find(
    (option) => option.seconds === disappearingDuration
  );

  const cycleDisappearing = () => {
    const currentIndex = DISAPPEARING_OPTIONS.findIndex(
      (option) => option.seconds === disappearingDuration
    );
    const next =
      DISAPPEARING_OPTIONS[(currentIndex + 1) % DISAPPEARING_OPTIONS.length];
    setDisappearingDuration(next.seconds);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (editingMessage) setEditingMessage(null);
      else if (replyingTo) setReplyingTo(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingMessage, replyingTo, setEditingMessage, setReplyingTo]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start audio recording:", err);
    }
  };

  const stopAndSendRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result;
          await useMessageStore
            .getState()
            .sendMessage("", "voice_note", base64Data);
        };
        reader.readAsDataURL(audioBlob);
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          audioStreamRef.current = null;
        }
      };
      recorder.stop();
    }
    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = () => {
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          audioStreamRef.current = null;
        }
      };
      recorder.stop();
    }
    setIsRecording(false);
  };

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const replyAuthorId = replyingTo?.sender?._id || replyingTo?.sender;
  const replyAuthor = replyAuthorId && replyAuthorId === authUserId ? "yourself" : replyingTo?.senderName || replyingTo?.sender?.name || "message";
  const isEditing = !!editingMessage;
  const isReplying = !!replyingTo && !isEditing;
  const canSend = text.trim().length > 0;

  return (
    <form onSubmit={onSend} className="relative z-10 flex shrink-0 flex-col border-t border-border bg-surface">
      <AnimatePresence>{children}</AnimatePresence>

      <div className="safe-bottom px-3 py-3 sm:px-4">
        <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-border bg-surface transition-colors focus-within:border-border-strong">
          <AnimatePresence initial={false}>
            {isEditing && (
              <ComposerBanner
                key="editing"
                icon={Pencil}
                title="Editing message"
                detail="Press Esc to cancel"
                dismissLabel="Cancel editing"
                onDismiss={() => setEditingMessage(null)}
              />
            )}
            {isReplying && (
              <ComposerBanner
                key="replying"
                icon={Reply}
                title={`Replying to ${replyAuthor}`}
                detail={REPLY_PREVIEW_LABELS[replyingTo.messageType] || replyingTo.content}
                dismissLabel="Cancel reply"
                onDismiss={() => setReplyingTo(null)}
              />
            )}
          </AnimatePresence>

          {isRecording ? (
            <div className="flex items-center justify-between gap-3 px-3 py-2.5" role="status">
              <div className="flex items-center gap-2.5">
                <span className="size-2 animate-pulse rounded-full bg-danger" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">Recording</span>
                <span className="tabular text-sm text-foreground-secondary">{formatDuration(recordingSeconds)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="sm" onClick={cancelRecording}>
                  Discard
                </Button>
                <Button size="sm" onClick={stopAndSendRecording}>
                  <Send aria-hidden="true" />
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={text}
                onChange={onTextChange}
                placeholder={isEditing ? "Edit your message" : "Write a message"}
                aria-label={isEditing ? "Edit message" : "Message"}
                autoFocus={isEditing}
                className="block w-full border-0 bg-transparent px-3.5 pb-1 pt-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-0"
              />
              <div className="flex items-center justify-between gap-2 px-1.5 pb-1.5">
                <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto scrollbar-none">
                  {!isEditing && (
                    <>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                      <ToolButton label="Attach a photo" icon={ImagePlus} onClick={() => fileInputRef.current?.click()} />
                      <ToolButton label="Send a GIF" icon={Smile} onClick={onToggleGifPicker} active={showGifPicker} />
                      <ToolButton label="Propose a date" icon={CalendarHeart} onClick={onOpenDateModal} />
                      <ToolButton label="Play two truths and a lie" icon={Gamepad2} onClick={onOpenGameModal} />
                      <ToolButton
                        label={isDisappearing ? `Disappearing messages: ${activeDisappearingOption?.label}` : "Disappearing messages off"}
                        icon={Timer}
                        onClick={cycleDisappearing}
                        active={isDisappearing}
                      >
                        {isDisappearing && <span className="tabular">{activeDisappearingOption?.label}</span>}
                      </ToolButton>
                      <span className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden="true" />
                      <ToolButton label="Wingman suggestions" icon={Sparkles} onClick={onToggleAIAssistant} active={showAIAssistant}>
                        <span className="hidden sm:inline">Wingman</span>
                      </ToolButton>
                    </>
                  )}
                </div>
                {isEditing ? (
                  <IconButton label="Save edit" type="submit" variant="primary" size="md" disabled={!canSend}>
                    <Check />
                  </IconButton>
                ) : canSend ? (
                  <IconButton label="Send message" type="submit" variant="primary" size="md">
                    <Send />
                  </IconButton>
                ) : (
                  <IconButton label="Record a voice message" variant="ghost" size="md" onClick={startRecording}>
                    <Mic />
                  </IconButton>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
