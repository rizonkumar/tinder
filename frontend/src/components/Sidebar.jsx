import { useEffect, useState } from "react";
import { Heart, Loader, MessageCircle, X, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore.jsx";
import { useAuthStore } from "../store/useAuthStore.jsx";
import { useMessageStore } from "../store/useMessageStore.jsx";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
  const { onlineUsers } = useAuthStore();
  const { activeChatUser } = useMessageStore();
  const location = useLocation();
  const isChatRoom = location.pathname.startsWith("/chat/") && location.pathname !== "/chat";

  useEffect(() => {
    getMyMatches();
  }, [getMyMatches]);

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 h-full overflow-hidden bg-white dark:bg-zinc-900 shadow-md border-r border-slate-100 dark:border-zinc-800/80 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:w-1/4 lg:translate-x-0 flex flex-col shrink-0`}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 px-4 h-[72px] shrink-0">
            <h2 className="text-2xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent font-outfit uppercase">
              Matches
            </h2>
            <button
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none lg:hidden"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrolling limited strictly to matches list wrapper */}
          <div className="relative z-10 flex-grow overflow-y-auto p-3 space-y-1 scrollbar-none bg-slate-50/30 dark:bg-zinc-900/10">
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
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <div
                      className={`flex cursor-pointer items-center rounded-2xl p-3 transition-all duration-300 ${
                        isActive
                          ? "bg-pink-50 dark:bg-pink-950/20 border-l-4 border-pink-500 shadow-sm"
                          : "hover:bg-slate-100/50 dark:hover:bg-zinc-800/30"
                      }`}
                    >
                      <div className="relative mr-3.5">
                        <img
                          src={match.image || "/avatar.png"}
                          alt={match.name}
                          className="size-11 rounded-full border border-slate-200 dark:border-zinc-800 object-cover"
                        />
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm ${
                            isOnline ? "bg-green-500" : "bg-slate-300 dark:bg-zinc-700"
                          }`}
                        />
                      </div>

                      <div className="flex flex-col overflow-hidden">
                        <div className="flex items-center space-x-1 overflow-hidden">
                          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">
                            {match.name}
                          </h3>
                          {isChatVerified && (
                            <span className="text-emerald-500 shrink-0 select-none animate-pulse" title="E2E Encryption Verified">
                              <ShieldCheck size={13} className="fill-emerald-500/10 stroke-[2.5]" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {isOnline ? "Active now" : "Offline"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {!isChatRoom && (
        <button
          className="fixed left-4 bottom-4 z-30 rounded-full bg-pink-500 hover:bg-pink-600 p-4 text-white shadow-2xl transition-transform hover:scale-105 active:scale-95 lg:hidden"
          onClick={toggleSidebar}
        >
          <MessageCircle size={26} />
        </button>
      )}
    </>
  );
};

export default Sidebar;

const NoMatchesFound = () => (
  <div className="flex h-full flex-col items-center justify-center text-center p-4 py-16">
    <div className="p-3.5 rounded-full bg-pink-50 dark:bg-pink-950/20 mb-4 animate-pulse">
      <Heart className="text-pink-500 fill-current" size={28} />
    </div>
    <h3 className="mb-1 text-base font-black text-slate-800 dark:text-slate-200 uppercase font-outfit">No Matches Yet</h3>
    <p className="max-w-[200px] text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
      Keep swiping! Your perfect match is out there, waiting for you to swipe right.
    </p>
  </div>
);

const LoadingState = () => (
  <div className="flex h-full flex-col items-center justify-center text-center p-4 py-16">
    <Loader className="mb-3 animate-spin text-pink-500" size={32} />
    <h3 className="mb-1 text-base font-bold text-slate-800 dark:text-slate-200 font-outfit">
      Loading Matches
    </h3>
    <p className="max-w-xs text-[11px] text-slate-400 dark:text-slate-500">Finding your matches...</p>
  </div>
);
