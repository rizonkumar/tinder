import { motion } from "framer-motion";

export default function ReactionPill({
  emoji,
  isSentByMe,
  onRemove,
  bottomOffset = "-bottom-2.5",
}) {
  if (!emoji) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={onRemove}
      className={`absolute ${bottomOffset} ${
        isSentByMe ? "left-3" : "right-3"
      } bg-gray-100 text-foreground border border-border rounded-full px-1.5 py-0.5 shadow-card text-[11px] leading-none flex items-center select-none cursor-pointer hover:scale-110 active:scale-95 transition-all`}
      title="Click to remove reaction"
    >
      {emoji}
    </motion.div>
  );
}
