import { useState } from "react";
import { Forward, Search, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING_TRANSITION = { type: "spring", stiffness: 350, damping: 25 };

const TYPE_SNIPPET = {
  image: "Photo",
  voice_note: "Voice message",
};

export default function ForwardModal({
  isOpen,
  message,
  matches,
  activeChatUserId,
  onClose,
  onForward,
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);

  const available = (matches || []).filter((m) => m._id !== activeChatUserId);
  const filtered = available.filter((m) =>
    m.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const reset = () => {
    setSelected([]);
    setQuery("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleForward = async () => {
    if (selected.length === 0) return;
    await Promise.all(selected.map((id) => onForward(message, id)));
    handleClose();
  };

  const snippet = message
    ? TYPE_SNIPPET[message.messageType] || message.content
    : "";

  return (
    <AnimatePresence>
      {isOpen && message && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={SPRING_TRANSITION}
            className="w-full max-w-md max-h-[90vh] flex flex-col bg-background border border-border shadow-modal p-6 font-sans text-foreground rounded-lg relative"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold tracking-tight font-outfit flex items-center gap-2">
                <Forward size={18} className="text-accent" />
                <span>Forward to</span>
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-foreground-muted hover:text-foreground-secondary focus:outline-none"
              >
                Cancel
              </button>
            </div>

            <div className="mb-4 rounded-md border border-border bg-background-secondary px-3 py-2">
              <span className="block text-[9px] font-black uppercase tracking-widest text-foreground-muted font-outfit mb-0.5">
                Message
              </span>
              <span className="block text-xs text-foreground-secondary truncate">
                {snippet}
              </span>
            </div>

            <div className="relative mb-3">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search matches..."
                className="w-full text-xs rounded-md border border-border bg-background pl-10 pr-4 py-2.5 focus-ring text-foreground placeholder:text-foreground-muted"
              />
            </div>

            <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-1 min-h-[120px] max-h-[40vh]">
              {filtered.length === 0 ? (
                <p className="text-center text-xs text-foreground-muted italic py-8">
                  No matches found.
                </p>
              ) : (
                filtered.map((match) => {
                  const isSelected = selected.includes(match._id);
                  return (
                    <button
                      key={match._id}
                      type="button"
                      onClick={() => toggle(match._id)}
                      className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors ${
                        isSelected ? "bg-surface-active" : "hover:bg-surface-hover"
                      }`}
                    >
                      <img
                        src={match.image || "/avatar.png"}
                        alt={match.name}
                        className="h-9 w-9 rounded-full object-cover border border-border"
                      />
                      <span className="flex-grow text-sm font-semibold truncate">
                        {match.name}
                      </span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                          isSelected
                            ? "bg-accent border-accent text-white"
                            : "border-border-strong"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <button
              type="button"
              onClick={handleForward}
              disabled={selected.length === 0}
              className="mt-4 w-full py-2.5 text-center text-xs font-bold text-primary-foreground bg-primary hover:bg-primary-hover rounded-md transition-colors font-outfit focus:outline-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Forward size={14} />
              <span>
                Forward{selected.length > 0 ? ` (${selected.length})` : ""}
              </span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
