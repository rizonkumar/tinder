import { Link } from "react-router-dom";
import { ArrowLeft, Search, Phone, Video, ShieldCheck, CalendarDays } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar";
import { IconButton } from "../../../components/ui/IconButton";
import { ROUTES } from "../../../constants/navigation";
import { cn } from "../../../utils/cn";

export default function ChatHeader({
  activeChatUser,
  isOnline,
  isEncryptionVerified,
  showSearchBar,
  onToggleSearch,
  onOpenProfile,
  onInitiateCall,
  onOpenDatePlanner,
}) {
  return (
    <div className="flex h-header shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-3 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Link
          to={ROUTES.chat}
          className="flex size-9 shrink-0 items-center justify-center rounded-md text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground focus-ring md:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeft size={18} />
        </Link>

        <button
          type="button"
          onClick={onOpenProfile}
          className="flex min-w-0 items-center gap-3 rounded-md py-1 pr-2 text-left transition-colors hover:bg-surface-hover focus-ring"
        >
          <Avatar src={activeChatUser.image} alt={activeChatUser.name} size="md" online={isOnline} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="label-14 truncate text-foreground">{activeChatUser.name}</p>
              {isEncryptionVerified && (
                <ShieldCheck size={14} className="shrink-0 text-success" aria-label="End-to-end encryption verified" />
              )}
            </div>
            <p className={cn("copy-13 truncate", isOnline ? "text-success" : "text-foreground-muted")}>
              {isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <IconButton label="Plan a date" onClick={onOpenDatePlanner}>
          <CalendarDays />
        </IconButton>
        <IconButton label="Search messages" onClick={onToggleSearch} active={showSearchBar}>
          <Search />
        </IconButton>
        {isOnline && (
          <>
            <IconButton label="Voice call" onClick={() => onInitiateCall("voice")}>
              <Phone />
            </IconButton>
            <IconButton label="Video call" onClick={() => onInitiateCall("video")}>
              <Video />
            </IconButton>
          </>
        )}
      </div>
    </div>
  );
}
