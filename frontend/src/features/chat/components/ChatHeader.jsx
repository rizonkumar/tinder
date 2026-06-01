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
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 p-4 shrink-0 bg-white dark:bg-zinc-900 z-10">
      <div className="flex items-center space-x-3 flex-grow overflow-hidden">
        <Link
          to="/chat"
          className="text-slate-400 hover:text-pink-500 lg:hidden transition-colors shrink-0"
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
              className="h-11 w-11 rounded-full border border-slate-200/50 dark:border-zinc-800 object-cover shadow-sm transition-transform duration-300 group-hover:scale-103"
            />
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                isOnline ? "bg-green-500" : "bg-slate-300 dark:bg-zinc-700"
              }`}
            />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center space-x-1.5 overflow-hidden">
              <h2 className="text-base font-bold text-slate-800 dark:text-zinc-200 leading-tight font-outfit group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors truncate">
                {activeChatUser.name}
              </h2>
              {isEncryptionVerified && (
                <span
                  className="text-emerald-500 shrink-0 select-none animate-pulse"
                  title="E2E Encryption Verified"
                >
                  <ShieldCheck
                    size={14}
                    className="fill-emerald-500/10 stroke-[2.2]"
                  />
                </span>
              )}
            </div>
            <div className="text-[11px] mt-0.5 font-medium truncate">
              {isOnline ? (
                <span className="text-green-500 font-semibold font-outfit">
                  Active now
                </span>
              ) : (
                <span className="text-slate-400 dark:text-slate-500 font-outfit">
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
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
          title="Collaborative Date Planner"
        >
          <CalendarDays size={15} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSearch}
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all focus:outline-none ${
            showSearchBar
              ? "bg-pink-500 border-pink-500 text-white shadow-sm shadow-pink-500/20"
              : "border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
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
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
              title="Voice Call"
            >
              <Phone size={15} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onInitiateCall("video")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
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
