import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Calendar,
  Sparkles,
  Mic,
  X,
  Check,
  Gamepad2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessageStore } from "../../../store/useMessageStore";

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

  const editingMessage = useMessageStore((state) => state.editingMessage);
  const setEditingMessage = useMessageStore((state) => state.setEditingMessage);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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

  return (
    <form
      onSubmit={onSend}
      className="border-t border-border bg-background shrink-0 relative flex flex-col z-10 select-none"
    >
      <AnimatePresence>{children}</AnimatePresence>

      <div className="flex items-center space-x-2.5 p-4 shrink-0">
        {editingMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="flex items-center space-x-2.5 w-full"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setEditingMessage(null)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-hover hover:bg-surface-active text-foreground-secondary focus:outline-none shrink-0"
              title="Cancel Edit"
            >
              <X size={17} />
            </motion.button>
            <input
              type="text"
              value={text}
              onChange={onTextChange}
              placeholder="Edit message..."
              className="flex-grow rounded-md border border-border bg-background px-5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus-ring transition-all"
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-green-700 hover:bg-green-800 text-white shadow-card focus:outline-none shrink-0"
              title="Save Edit"
            >
              <Check size={17} />
            </motion.button>
          </motion.div>
        ) : isRecording ? (
          <div className="flex-grow flex items-center justify-between bg-background-secondary rounded-full px-4 py-2 border border-border select-none">
            <div className="flex items-center space-x-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-800 font-outfit shrink-0">
                Recording
              </span>
              <span className="text-xs font-semibold text-foreground-secondary font-sans">
                {formatDuration(recordingSeconds)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={cancelRecording}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-hover hover:bg-surface-active text-foreground-secondary hover:text-foreground transition-colors focus:outline-none"
                title="Cancel"
              >
                <X size={14} />
              </button>
              <button
                type="button"
                onClick={stopAndSendRecording}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary-hover text-primary-foreground transition-colors focus:outline-none animate-bounce"
                title="Send"
              >
                <Send size={13} className="ml-0.5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
              id="chat-photo-input"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-background-secondary border border-border text-foreground-secondary hover:text-accent transition-colors focus-ring shrink-0"
              title="Attach Photo"
            >
              <Paperclip size={17} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onToggleGifPicker}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-ring shrink-0 ${
                showGifPicker
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-background-secondary border-border text-foreground-secondary hover:text-accent"
              }`}
              title="Share GIF"
            >
              <Smile size={17} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onOpenDateModal}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-background-secondary border border-border text-foreground-secondary hover:text-accent transition-colors focus-ring shrink-0"
              title="Plan a Date"
            >
              <Calendar size={17} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onOpenGameModal}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-background-secondary border border-border text-foreground-secondary hover:text-accent transition-colors focus-ring shrink-0"
              title="Play Two Truths & a Lie"
            >
              <Gamepad2 size={17} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onToggleAIAssistant}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-ring shrink-0 ${
                showAIAssistant
                  ? "bg-primary border-primary text-primary-foreground shadow-card"
                  : "bg-background-secondary border-border text-foreground-secondary hover:text-accent"
              }`}
              title="AI Assistant"
            >
              <Sparkles size={17} />
            </motion.button>

            <input
              type="text"
              value={text}
              onChange={onTextChange}
              placeholder="Type a message..."
              className="flex-grow rounded-md border border-border bg-background px-5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted transition-all focus-ring"
            />

            {text.trim() ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-all hover:bg-primary-hover focus:outline-none shrink-0"
              >
                <Send size={16} className="ml-0.5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={startRecording}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-all hover:bg-primary-hover focus:outline-none shrink-0"
                title="Record Voice Note"
              >
                <Mic size={17} />
              </motion.button>
            )}
          </>
        )}
      </div>
    </form>
  );
}
