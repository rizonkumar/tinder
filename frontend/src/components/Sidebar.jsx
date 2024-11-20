import { useEffect, useState } from "react";
import { Heart, Loader, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore.jsx";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();

  console.log("Matched", matches);
  useEffect(() => {
    getMyMatches();
  }, [getMyMatches]);

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-10 w-64 overflow-hidden bg-white shadow-md transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:w-1/4 lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-pink-200 p-4 pb-[27px]">
            <h2 className="text-xl font-bold text-pink-600">Matches</h2>
            <button
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative z-10 flex-grow overflow-y-auto p-4">
            {isLoadingMyMatches ? (
              <LoadingState />
            ) : matches?.length === 0 ? (
              <NoMatchesFound />
            ) : (
              matches?.map((match) => (
                <Link key={match._id} to={`/chat/${match._id}`}>
                  <div className="mb-4 flex cursor-pointer items-center rounded-lg p-2 transition-colors duration-300 hover:bg-pink-50">
                    <img
                      src={match.image || "/avatar.png"}
                      alt="User avatar"
                      className="mr-3 size-12 rounded-full border-2 border-pink-300 object-cover"
                    />

                    <h3 className="font-semibold text-gray-800">
                      {match.name}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        className="fixed left-4 top-4 z-0 rounded-md bg-pink-500 p-2 text-white lg:hidden"
        onClick={toggleSidebar}
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
};
export default Sidebar;

const NoMatchesFound = () => (
  <div className="flex h-full flex-col items-center justify-center text-center">
    <Heart className="mb-4 text-pink-400" size={48} />
    <h3 className="mb-2 text-xl font-semibold text-gray-700">No Matches Yet</h3>
    <p className="max-w-xs text-gray-500">
      Don&apos;t worry! Your perfect match is just around the corner. Keep
      swiping!
    </p>
  </div>
);

const LoadingState = () => (
  <div className="flex h-full flex-col items-center justify-center text-center">
    <Loader className="mb-4 animate-spin text-pink-500" size={48} />
    <h3 className="mb-2 text-xl font-semibold text-gray-700">
      Loading Matches
    </h3>
    <p className="max-w-xs text-gray-500">
      We&apos;re finding your perfect matches. This might take a moment...
    </p>
  </div>
);
