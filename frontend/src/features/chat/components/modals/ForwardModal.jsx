import { useMemo, useState } from "react";
import { Forward, Search, Check, Users } from "lucide-react";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Field";
import { Avatar } from "../../../../components/ui/Avatar";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { cn } from "../../../../utils/cn";

const TYPE_SNIPPET = { image: "Photo", voice_note: "Voice message" };

export default function ForwardModal({ isOpen, message, matches, activeChatUserId, onClose, onForward }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (matches || []).filter((match) => match._id !== activeChatUserId && match.name.toLowerCase().includes(term));
  }, [matches, activeChatUserId, query]);

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const handleClose = () => {
    setSelected([]);
    setQuery("");
    onClose();
  };

  const handleForward = async () => {
    if (selected.length === 0) return;
    setIsSending(true);
    await Promise.all(selected.map((id) => onForward(message, id)));
    setIsSending(false);
    handleClose();
  };

  const snippet = message ? TYPE_SNIPPET[message.messageType] || message.content : "";

  return (
    <Modal
      open={isOpen && !!message}
      onClose={handleClose}
      icon={Forward}
      title="Forward message"
      description={snippet}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleForward} disabled={selected.length === 0} loading={isSending}>
            {selected.length > 1 ? `Forward to ${selected.length}` : "Forward"}
          </Button>
        </>
      }
    >
      <div className="space-y-3 p-5">
        <Input
          icon={Search}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search matches"
          aria-label="Search matches"
        />
        {filtered.length === 0 ? (
          <EmptyState compact icon={Users} title="No matches found" description="Try a different name." />
        ) : (
          <ul className="max-h-72 space-y-0.5 overflow-y-auto" role="listbox" aria-multiselectable="true">
            {filtered.map((match) => {
              const isSelected = selected.includes(match._id);
              return (
                <li key={match._id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggle(match._id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors focus-ring",
                      isSelected ? "bg-surface-active" : "hover:bg-surface-hover"
                    )}
                  >
                    <Avatar src={match.image} alt={match.name} size="sm" />
                    <span className="label-14 min-w-0 flex-1 truncate text-foreground">{match.name}</span>
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                        isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border-strong"
                      )}
                    >
                      {isSelected && <Check size={12} strokeWidth={2.5} aria-hidden="true" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}
