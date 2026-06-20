import { useEffect } from "react";
import { Heart, Loader, ShieldCheck, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore.jsx";
import { useAuthStore } from "../store/useAuthStore.jsx";
import { useMessageStore } from "../store/useMessageStore.jsx";
import { useLayoutStore } from "../store/useLayoutStore.js";

const Sidebar = () => {
  const { isSidebarOpen, setSidebarOpen } = useLayoutStore();
  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
  const { onlineUsers } = useAuthStore();
  const { activeChatUser } = useMessageStore();
  const location = useLocation();

  useEffect(() => {
    getMyMatches();
  }, [getMyMatches]);

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col overflow-hidden border-r border-border bg-background transition-all duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 lg:shrink-0 ${
          isSidebarOpen
            ? "translate-x-0 lg:w-80"
            : "-translate-x-full lg:w-0 lg:border-r-0"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-secondary">
            Matches
          </h2>
          <button
            className="rounded-md p-1.5 text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-ring lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative z-10 flex-grow space-y-1 overflow-y-auto bg-background-secondary p-3 scrollbar-none">
          {isLoadingMyMatches ? (
            <LoadingState />
          ) : matches?.length === 0 ? (
            <NoMatchesFound />
          ) : (
            matches?.map((match) => {
              const isOnline = onlineUsers.includes(match._id);
              const isActive = activeChatUser?._id === match._id;
              const verifiedSaved = localStorage.getItem("verified-chats");
              const verifiedMap = verifiedSaved ? JSON.parse(verifiedSaved) : {};
              const isChatVerified = !!verifiedMap[match._id];

              return (
                <Link
                  key={match._id}
                  to={`/chat/${match._id}`}
                  onClick={() => {
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className="block"
                >
                  <div
                    className={`flex cursor-pointer items-center rounded-md p-3 transition-all duration-200 ${
                      isActive
                        ? "border-l-4 border-accent bg-accent/10 shadow-card"
                        : "hover:bg-surface-hover"
                    }`}
                  >
                    <div className="relative mr-3.5">
                      <img
                        src={match.image || "/avatar.png"}
                        alt={match.name}
                        className="size-11 rounded-full border border-border object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background shadow-card ${
                          isOnline ? "bg-green-700" : "bg-gray-400"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <div className="flex items-center space-x-1 overflow-hidden">
                        <h3 className="truncate text-sm font-bold text-foreground">
                          {match.name}
                        </h3>
                        {isChatVerified && (
                          <span
                            className="shrink-0 select-none text-green-700"
                            title="E2E Encryption Verified"
                          >
                            <ShieldCheck size={13} className="fill-green-700/10 stroke-[2.5]" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-foreground-secondary">
                        {isOnline ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

const NoMatchesFound = () => (
  <div className="flex h-full flex-col items-center justify-center p-4 py-16 text-center">
    <div className="mb-4 rounded-full bg-green-100 p-3.5">
      <Heart className="fill-current text-green-700" size={28} />
    </div>
    <h3 className="mb-1 text-base font-bold uppercase text-foreground">No Matches Yet</h3>
    <p className="max-w-[200px] text-[11px] font-medium leading-relaxed text-foreground-muted">
      Keep swiping! Your perfect match is out there, waiting for you to swipe right.
    </p>
  </div>
);

const LoadingState = () => (
  <div className="flex h-full flex-col items-center justify-center p-4 py-16 text-center">
    <Loader className="mb-3 animate-spin text-accent" size={32} />
    <h3 className="mb-1 text-base font-bold text-foreground">Loading Matches</h3>
    <p className="max-w-xs text-[11px] text-foreground-muted">Finding your matches...</p>
  </div>
);
