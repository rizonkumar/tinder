import { motion } from "framer-motion";

const DOT_DELAYS = [0, 0.15, 0.3];

export default function TypingIndicator({ userName }) {
  return (
    <div className="flex justify-start my-2 animate-pulse">
      <div className="bg-background text-foreground border border-border rounded-2xl rounded-tl-none px-4 py-2.5 shadow-card text-xs flex items-center space-x-1.5 font-outfit">
        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider font-outfit pr-0.5">
          {userName} is typing
        </span>
        <div className="flex items-center space-x-1 h-3">
          {DOT_DELAYS.map((delay) => (
            <motion.div
              key={delay}
              animate={{ y: [0, -3, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                delay,
              }}
              className="w-1.5 h-1.5 rounded-full bg-accent"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
