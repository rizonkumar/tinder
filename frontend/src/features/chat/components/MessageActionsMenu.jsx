import { useLayoutEffect, useRef, useState } from "react";
import { Reply, Forward, Copy, Edit3, Pin, PinOff, Trash, Trash2, Smile } from "lucide-react";
import { cn } from "../../../utils/cn";

const FORWARDABLE_TYPES = ["text", "image", "voice_note"];
const MENU_ESTIMATED_HEIGHT = 280;

function MenuItem({ icon: Icon, label, onSelect, tone = "default" }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn(
        "flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[0.8125rem] transition-colors focus-ring",
        tone === "danger" ? "text-danger hover:bg-danger-surface" : "text-foreground hover:bg-surface-hover"
      )}
    >
      <Icon size={14} className={tone === "danger" ? "text-danger" : "text-foreground-muted"} aria-hidden="true" />
      {label}
    </button>
  );
}

function MenuDivider() {
  return <div className="my-1 h-px bg-border" role="separator" />;
}

export default function MessageActionsMenu({
  message,
  isSentByMe,
  onReply,
  onForward,
  onEdit,
  onDelete,
  onTogglePin,
  onReact,
  onClose,
}) {
  const menuRef = useRef(null);
  const [openUpwards, setOpenUpwards] = useState(false);

  useLayoutEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    setOpenUpwards(rect.top + MENU_ESTIMATED_HEIGHT > window.innerHeight);
  }, []);

  const run = (action) => () => {
    action();
    onClose();
  };

  const canForward = onForward && !message.isDeleted && FORWARDABLE_TYPES.includes(message.messageType);
  const canEdit = isSentByMe && !message.isDeleted && onEdit;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Message actions"
      className={cn(
        "absolute z-50 w-48 rounded-lg border border-border bg-surface p-1 shadow-popover",
        openUpwards ? "bottom-full mb-1.5" : "top-full mt-1.5",
        isSentByMe ? "right-0" : "left-0"
      )}
    >
      <MenuItem icon={Reply} label="Reply" onSelect={run(() => onReply(message))} />
      {onReact && <MenuItem icon={Smile} label="React" onSelect={run(() => onReact(message._id))} />}
      {canForward && <MenuItem icon={Forward} label="Forward" onSelect={run(() => onForward(message))} />}
      <MenuItem
        icon={message.isPinned ? PinOff : Pin}
        label={message.isPinned ? "Unpin" : "Pin"}
        onSelect={run(() => onTogglePin(message._id, !message.isPinned))}
      />
      {message.content && !message.isDeleted && (
        <MenuItem icon={Copy} label="Copy text" onSelect={run(() => navigator.clipboard.writeText(message.content))} />
      )}
      {canEdit && <MenuItem icon={Edit3} label="Edit" onSelect={run(() => onEdit(message._id))} />}
      <MenuDivider />
      {isSentByMe && !message.isDeleted && (
        <MenuItem icon={Trash2} label="Delete for everyone" tone="danger" onSelect={run(() => onDelete(message._id, true))} />
      )}
      <MenuItem icon={Trash} label="Delete for me" tone="danger" onSelect={run(() => onDelete(message._id, false))} />
    </div>
  );
}
