import { motion } from "framer-motion";

const DOT_DELAYS = [0, 0.15, 0.3];

export default function TypingIndicator({ userName }) {
  return (
    <div className="flex justify-start my-2 animate-pulse">
      <div className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200/40 dark:border-zinc-800/80 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm text-xs flex items-center space-x-1.5 font-outfit">
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-outfit pr-0.5">
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
              className="w-1.5 h-1.5 rounded-full bg-pink-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
