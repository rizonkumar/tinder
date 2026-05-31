import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Calendar, Sparkles, Mic, X, Check } from "lucide-react";
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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result;
          await useMessageStore.getState().sendMessage("", "voice_note", base64Data);
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
      className="border-t border-slate-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shrink-0 relative flex flex-col z-10 select-none"
    >
      <AnimatePresence>
        {children}
      </AnimatePresence>

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
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-555 dark:text-zinc-400 focus:outline-none shrink-0"
              title="Cancel Edit"
            >
              <X size={17} />
            </motion.button>
            <input
              type="text"
              value={text}
              onChange={onTextChange}
              placeholder="Edit message..."
              className="flex-grow rounded-full border border-pink-500/70 dark:border-pink-500/70 bg-slate-50/50 dark:bg-zinc-950/40 px-5 py-2.5 text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-slate-550 outline-none focus:bg-white dark:focus:bg-zinc-950 transition-all"
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/10 focus:outline-none shrink-0"
              title="Save Edit"
            >
              <Check size={17} />
            </motion.button>
          </motion.div>
        ) : isRecording ? (
          <div className="flex-grow flex items-center justify-between bg-slate-50 dark:bg-zinc-950/60 rounded-full px-4 py-2 border border-slate-200/50 dark:border-zinc-800 select-none">
            <div className="flex items-center space-x-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500 font-outfit shrink-0">
                Recording
              </span>
              <span className="text-xs font-semibold text-slate-550 dark:text-zinc-400 font-sans">
                {formatDuration(recordingSeconds)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={cancelRecording}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                title="Cancel"
              >
                <X size={14} />
              </button>
              <button
                type="button"
                onClick={stopAndSendRecording}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 hover:bg-pink-650 text-white transition-colors focus:outline-none animate-bounce"
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
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 text-slate-550 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors focus:outline-none shrink-0"
              title="Attach Photo"
            >
              <Paperclip size={17} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onToggleGifPicker}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus:outline-none shrink-0 ${
                showGifPicker
                  ? "bg-pink-500 border-pink-500 text-white"
                  : "bg-slate-50 dark:bg-zinc-900 border-slate-200/50 dark:border-zinc-800 text-slate-550 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400"
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
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 text-slate-550 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors focus:outline-none shrink-0"
              title="Plan a Date"
            >
              <Calendar size={17} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onToggleAIAssistant}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus:outline-none shrink-0 ${
                showAIAssistant
                  ? "bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/25"
                  : "bg-slate-50 dark:bg-zinc-900 border-slate-200/50 dark:border-zinc-800 text-slate-555 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400"
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
              className="flex-grow rounded-full border border-slate-200/60 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 px-5 py-2.5 text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-slate-550 outline-none transition-all focus:border-pink-500 dark:focus:border-pink-500 focus:bg-white dark:focus:bg-zinc-950"
            />

            {text.trim() ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm transition-all hover:bg-pink-600 active:bg-pink-700 focus:outline-none shrink-0"
              >
                <Send size={16} className="ml-0.5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={startRecording}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm transition-all hover:bg-pink-650 active:bg-pink-700 focus:outline-none shrink-0"
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
