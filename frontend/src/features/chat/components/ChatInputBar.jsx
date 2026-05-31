import { useRef } from "react";
import { Send, Paperclip, Smile, Calendar, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <form
      onSubmit={onSend}
      className="border-t border-slate-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shrink-0 relative flex flex-col z-10 select-none"
    >
      <AnimatePresence>
        {children}
      </AnimatePresence>

      <div className="flex items-center space-x-2.5 p-4 shrink-0">
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
              : "bg-slate-50 dark:bg-zinc-900 border-slate-200/50 dark:border-zinc-800 text-slate-550 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400"
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
          className="flex-grow rounded-full border border-slate-200/60 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 px-5 py-2.5 text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-pink-500 dark:focus:border-pink-500 focus:bg-white dark:focus:bg-zinc-950"
        />

        <motion.button
          whileHover={{ scale: text.trim() ? 1.05 : 1 }}
          whileTap={{ scale: text.trim() ? 0.95 : 1 }}
          type="submit"
          disabled={!text.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm transition-all hover:bg-pink-600 active:bg-pink-700 disabled:bg-slate-100 dark:disabled:bg-zinc-900 disabled:text-slate-400 dark:disabled:text-zinc-500 disabled:shadow-none focus:outline-none shrink-0"
        >
          <Send size={16} className="ml-0.5" />
        </motion.button>
      </div>
    </form>
  );
}
