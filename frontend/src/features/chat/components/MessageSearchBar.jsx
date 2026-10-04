import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../../../components/ui/Field";
import { IconButton } from "../../../components/ui/IconButton";

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
  const hasMatches = searchMatches.length > 0;

  const handleKeyDown = (event) => {
    if (event.key === "Escape") onClose();
    if (event.key === "Enter" && hasMatches) {
      event.preventDefault();
      if (event.shiftKey) onPrev();
      else onNext();
    }
  };

  return (
    <AnimatePresence initial={false}>
      {showSearchBar && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="shrink-0 overflow-hidden border-b border-border bg-surface"
        >
          <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
            <div className="min-w-0 flex-1">
              <Input
                icon={Search}
                type="search"
                value={searchQuery}
                onChange={(event) => onSearch(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search in conversation"
                aria-label="Search in conversation"
                className="h-9"
                autoFocus
              />
            </div>
            <span className="tabular min-w-[3.5rem] text-center text-xs text-foreground-muted" aria-live="polite">
              {searchQuery ? (hasMatches ? `${currentMatchIndex + 1} of ${searchMatches.length}` : "No results") : ""}
            </span>
            <IconButton label="Previous result" size="sm" onClick={onPrev} disabled={!hasMatches}>
              <ChevronUp />
            </IconButton>
            <IconButton label="Next result" size="sm" onClick={onNext} disabled={!hasMatches}>
              <ChevronDown />
            </IconButton>
            <IconButton label="Close search" size="sm" onClick={onClose}>
              <X />
            </IconButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
