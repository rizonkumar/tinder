import { motion, AnimatePresence } from "framer-motion";
import { EMOJI_REACTIONS } from "../../../constants";

export default function ReactionPicker({
  messageId,
  isSentByMe,
  isActive,
  onReact,
  onClose,
}) {
  return (
    <AnimatePresence>
      {isActive && (
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
              onClick={() => {
                onReact(messageId, emoji);
                onClose();
              }}
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
