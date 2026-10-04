import { motion } from "framer-motion";

const DOT_DELAYS = [0, 0.15, 0.3];

export default function TypingIndicator({ userName }) {
  return (
    <div className="mt-3 flex justify-start" role="status" aria-label={`${userName} is typing`}>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-border bg-bubble-received px-3.5 py-2.5">
        <span className="flex h-3 items-center gap-1" aria-hidden="true">
          {DOT_DELAYS.map((delay) => (
            <motion.span
              key={delay}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.1, delay }}
              className="size-1.5 rounded-full bg-foreground-muted"
            />
          ))}
        </span>
        <span className="copy-13 text-foreground-muted">{userName} is typing</span>
      </div>
    </div>
  );
}
