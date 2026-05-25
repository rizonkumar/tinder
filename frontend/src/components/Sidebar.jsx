import { useEffect, useState } from "react";
import { Heart, Loader, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore.jsx";
import { useAuthStore } from "../store/useAuthStore.jsx";
import { useMessageStore } from "../store/useMessageStore.jsx";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
  const { onlineUsers } = useAuthStore();
  const { activeChatUser } = useMessageStore();

  useEffect(() => {
    getMyMatches();
  }, [getMyMatches]);

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 overflow-hidden bg-white shadow-lg border-r border-pink-100 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:w-1/4 lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-pink-100 p-4 pb-6">
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Matches
            </h2>
            <button
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
          </div>

          {/* List Area */}
          <div className="relative z-10 flex-grow overflow-y-auto p-3 space-y-1">
            {isLoadingMyMatches ? (
              <LoadingState />
            ) : matches?.length === 0 ? (
              <NoMatchesFound />
            ) : (
              matches?.map((match) => {
                const isOnline = onlineUsers.includes(match._id);
                const isActive = activeChatUser?._id === match._id;

                return (
                  <Link
                    key={match._id}
                    to={`/chat/${match._id}`}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <div
                      className={`flex cursor-pointer items-center rounded-2xl p-3 transition-all duration-300 hover:bg-pink-50/60 ${
                        isActive
                          ? "bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-500 shadow-sm"
                          : ""
                      }`}
                    >
                      <div className="relative mr-3.5">
                        <img
                          src={match.image || "/avatar.png"}
                          alt={match.name}
                          className="size-12 rounded-full border-2 border-pink-200 object-cover shadow-sm"
                        />
                        <span
                          className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ${
                            isOnline ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      </div>

                      <div className="flex flex-col">
                        <h3 className="font-bold text-gray-800 text-base">
                          {match.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1">
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

      <button
        className="fixed left-4 bottom-4 z-30 rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-4 text-white shadow-2xl transition-transform hover:scale-105 active:scale-95 lg:hidden"
        onClick={toggleSidebar}
      >
        <MessageCircle size={26} />
      </button>
    </>
  );
};

export default Sidebar;

const NoMatchesFound = () => (
  <div className="flex h-full flex-col items-center justify-center text-center p-4 py-16">
    <Heart className="mb-4 text-pink-300 animate-pulse" size={54} />
    <h3 className="mb-2 text-lg font-bold text-gray-700">No Matches Yet</h3>
    <p className="max-w-xs text-sm text-gray-500 leading-relaxed">
      Keep swiping! Your perfect match is out there, waiting for you to swipe
      right.
    </p>
  </div>
);

const LoadingState = () => (
  <div className="flex h-full flex-col items-center justify-center text-center p-4 py-16">
    <Loader className="mb-4 animate-spin text-pink-500" size={50} />
    <h3 className="mb-2 text-lg font-semibold text-gray-700">
      Loading Matches
    </h3>
    <p className="max-w-xs text-sm text-gray-500">Finding your matches...</p>
  </div>
);
