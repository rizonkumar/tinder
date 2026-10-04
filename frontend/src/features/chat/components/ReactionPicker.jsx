import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EMOJI_REACTIONS } from "../../../constants";
import { cn } from "../../../utils/cn";

const MIN_SPACE_ABOVE = 160;

export default function ReactionPicker({ messageId, isSentByMe, isOpen, onAddReaction }) {
  const pickerRef = useRef(null);
  const [renderBelow, setRenderBelow] = useState(false);

  useEffect(() => {
    if (!isOpen || !pickerRef.current) return;
    setRenderBelow(pickerRef.current.getBoundingClientRect().top < MIN_SPACE_ABOVE);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={pickerRef}
          role="menu"
          aria-label="Add reaction"
          initial={{ opacity: 0, scale: 0.95, y: renderBelow ? -4 : 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.12 }}
          className={cn(
            "absolute z-30 flex items-center gap-0.5 rounded-full border border-border bg-surface p-1 shadow-popover",
            renderBelow ? "top-full mt-2" : "bottom-full mb-2",
            isSentByMe ? "right-0" : "left-0"
          )}
        >
          {EMOJI_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              role="menuitem"
              aria-label={`React with ${emoji}`}
              onClick={() => onAddReaction(messageId, emoji)}
              className="flex size-8 items-center justify-center rounded-full text-base leading-none transition-colors hover:bg-surface-hover focus-ring"
            >
              {emoji}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
