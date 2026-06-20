import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Phone,
  Video,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="flex items-center justify-between border-b border-border p-4 shrink-0 bg-background z-10">
      <div className="flex items-center space-x-3 flex-grow overflow-hidden">
        <Link
          to="/chat"
          className="text-foreground-muted hover:text-accent lg:hidden transition-colors shrink-0"
        >
          <ArrowLeft size={22} />
        </Link>

        <div
          onClick={onOpenProfile}
          className="flex items-center space-x-3 cursor-pointer select-none group flex-grow overflow-hidden"
        >
          <div className="relative shrink-0">
            <img
              src={activeChatUser.image || "/avatar.png"}
              alt={activeChatUser.name}
              className="h-11 w-11 rounded-full border border-border object-cover shadow-card transition-transform duration-300 group-hover:scale-103"
            />
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center space-x-1.5 overflow-hidden">
              <h2 className="text-base font-bold text-foreground leading-tight font-outfit group-hover:text-accent transition-colors truncate">
                {activeChatUser.name}
              </h2>
              {isEncryptionVerified && (
                <span
                  className="text-green-600 shrink-0 select-none animate-pulse"
                  title="E2E Encryption Verified"
                >
                  <ShieldCheck
                    size={14}
                    className="fill-green-600/10 stroke-[2.2]"
                  />
                </span>
              )}
            </div>
            <div className="text-[11px] mt-0.5 font-medium truncate">
              {isOnline ? (
                <span className="text-green-600 font-semibold font-outfit">
                  Active now
                </span>
              ) : (
                <span className="text-foreground-muted font-outfit">
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenDatePlanner}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background-secondary text-foreground-secondary hover:bg-surface-hover transition-all focus-ring"
          title="Collaborative Date Planner"
        >
          <CalendarDays size={15} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSearch}
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all focus-ring ${
            showSearchBar
              ? "bg-primary border-primary text-primary-foreground shadow-card"
              : "border-border bg-background-secondary text-foreground-secondary hover:bg-surface-hover"
          }`}
          title="Search Messages"
        >
          <Search size={15} />
        </motion.button>

        {isOnline && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onInitiateCall("voice")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background-secondary text-foreground-secondary hover:bg-surface-hover transition-all focus-ring"
              title="Voice Call"
            >
              <Phone size={15} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onInitiateCall("video")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background-secondary text-foreground-secondary hover:bg-surface-hover transition-all focus-ring"
              title="Video Call"
            >
              <Video size={15} />
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
