import { Link } from "react-router-dom";
import { Heart, MessageCircle, ShieldCheck } from "lucide-react";
import LoadingState from "../../../components/common/LoadingState";
import FallbackState from "../../../components/common/FallbackState";

export default function NoChatSelected({
  matches,
  isLoadingMyMatches,
  onlineUsers,
}) {
  return (
    <div className="flex flex-col flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-zinc-950 select-none">
      <FallbackState
        icon={Heart}
        title="Your Chats"
        description="Select a match from the sidebar list to start exchanging sweet messages and setting up dates!"
        className="hidden bg-white dark:bg-zinc-900 rounded-3xl m-4 border border-slate-200/50 dark:border-zinc-800/80 shadow-sm lg:flex lg:flex-grow"
      />

      <div className="flex flex-col flex-grow lg:hidden">
        <div className="flex items-center space-x-3 mb-6">
          <div className="rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-100/40 dark:border-pink-900/30 p-2.5 text-pink-600 dark:text-pink-400">
            <MessageCircle size={22} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-zinc-100 font-outfit">
            MESSAGES
          </h1>
        </div>

        {isLoadingMyMatches ? (
          <div className="flex flex-grow items-center justify-center py-20">
            <LoadingState message="" type="inline" />
          </div>
        ) : matches?.length === 0 ? (
          <FallbackState
            icon={Heart}
            title="No Matches Yet"
            description="Once you match with someone, they will appear here so you can start chatting!"
            className="border border-slate-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm py-16 rounded-3xl"
          />
        ) : (
          <div className="space-y-3">
            {matches.map((match) => {
              const isOnline = onlineUsers.includes(match._id);
              return (
                <Link
                  key={match._id}
                  to={`/chat/${match._id}`}
                  className="flex items-center rounded-2xl border border-slate-200/50 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 p-3.5 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-[0.99]"
                >
                  <div className="relative mr-3.5">
                    <img
                      src={match.image || "/avatar.png"}
                      alt={match.name}
                      className="h-11 w-11 rounded-full border border-slate-200/50 dark:border-zinc-800 object-cover shadow-sm"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm ${
                        isOnline
                          ? "bg-green-500"
                          : "bg-slate-350 dark:bg-zinc-700"
                      }`}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-1.5 overflow-hidden">
                      <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-base leading-snug font-outfit truncate">
                        {match.name}
                      </h3>
                      {(() => {
                        const verifiedSaved =
                          localStorage.getItem("verified-chats");
                        const verifiedMap = verifiedSaved
                          ? JSON.parse(verifiedSaved)
                          : {};
                        return verifiedMap[match._id] ? (
                          <span
                            className="text-emerald-500 shrink-0 select-none animate-pulse"
                            title="E2E Encryption Verified"
                          >
                            <ShieldCheck
                              size={14}
                              className="fill-emerald-500/10 stroke-[2.2]"
                            />
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-none mt-1">
                      {isOnline ? "Active now" : "Offline"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
