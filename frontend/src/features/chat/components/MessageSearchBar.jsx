import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MessageSearchBar({
  showSearchBar,
  searchQuery,
  onSearch,
  searchMatches,
  currentMatchIndex,
  onPrev,
  onNext,
  onClose,
}) {
  return (
    <AnimatePresence>
      {showSearchBar && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center space-x-3 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200/40 dark:border-zinc-800/80 px-4 py-2.5 shrink-0 select-none"
        >
          <div className="relative flex-grow">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search conversation..."
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-9 pr-8 py-2 outline-none focus:border-pink-500 text-slate-800 dark:text-zinc-100"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {searchMatches.length > 0 && (
            <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 dark:text-zinc-400 shrink-0 font-outfit uppercase tracking-wider">
              <span>
                {currentMatchIndex + 1} of {searchMatches.length}
              </span>
              <button
                type="button"
                onClick={onPrev}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors uppercase tracking-widest text-[9px]"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={onNext}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors uppercase tracking-widest text-[9px]"
              >
                Next
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-slate-655 dark:hover:text-zinc-300 focus:outline-none shrink-0"
          >
            Cancel
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
