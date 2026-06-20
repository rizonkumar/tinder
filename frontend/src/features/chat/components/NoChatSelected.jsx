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
    <div className="flex flex-col flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background-secondary select-none">
      <FallbackState
        icon={Heart}
        title="Your Chats"
        description="Select a match from the sidebar list to start exchanging sweet messages and setting up dates!"
        className="hidden bg-background rounded-3xl m-4 border border-border shadow-card lg:flex lg:flex-grow"
      />

      <div className="flex flex-col flex-grow lg:hidden">
        <div className="flex items-center space-x-3 mb-6">
          <div className="rounded-2xl bg-background-secondary border border-border p-2.5 text-accent">
            <MessageCircle size={22} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">
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
            className="border border-border bg-background shadow-card py-16 rounded-3xl"
          />
        ) : (
          <div className="space-y-3">
            {matches.map((match) => {
              const isOnline = onlineUsers.includes(match._id);
              return (
                <Link
                  key={match._id}
                  to={`/chat/${match._id}`}
                  className="flex items-center rounded-2xl border border-border bg-background p-3.5 shadow-card transition-all hover:bg-surface-hover active:scale-[0.99]"
                >
                  <div className="relative mr-3.5">
                    <img
                      src={match.image || "/avatar.png"}
                      alt={match.name}
                      className="h-11 w-11 rounded-full border border-border object-cover shadow-card"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background shadow-card ${
                        isOnline
                          ? "bg-green-700"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-1.5 overflow-hidden">
                      <h3 className="font-bold text-foreground text-base leading-snug font-outfit truncate">
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
                            className="text-green-700 shrink-0 select-none animate-pulse"
                            title="E2E Encryption Verified"
                          >
                            <ShieldCheck
                              size={14}
                              className="stroke-[2.2]"
                            />
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <p className="text-xs text-foreground-muted leading-none mt-1">
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
