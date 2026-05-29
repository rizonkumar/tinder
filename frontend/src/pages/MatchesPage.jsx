import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";
import { Heart, MessageCircle, Loader, Flame, Sparkles, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function MatchesPage() {
  const {
    getMyMatches,
    matches,
    isLoadingMyMatches,
    getLikedUsers,
    likedUsers,
    isLoadingLikedUsers
  } = useMatchStore();

  const [activeTab, setActiveTab] = useState("matches");

  useEffect(() => {
    getMyMatches();
    getLikedUsers();
  }, [getMyMatches, getLikedUsers]);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 lg:flex-row">
      <Sidebar />
      <div className="flex flex-grow flex-col overflow-hidden bg-white/40 backdrop-blur-sm lg:w-3/4">
        <Header />

        <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl space-y-8 select-none">
            <div className="flex items-center space-x-3.5">
              <div className="rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 p-3 text-white shadow-lg shadow-pink-500/20">
                <Heart size={26} className="fill-current animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-gray-800">
                  Your Connections
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  See mutual connections and profiles you liked!
                </p>
              </div>
            </div>

            <div className="flex w-full space-x-5 border-b border-gray-100 pb-1">
              <button
                onClick={() => setActiveTab("matches")}
                className={`relative flex items-center space-x-2 pb-4 text-sm font-extrabold tracking-wide outline-none transition-all ${
                  activeTab === "matches"
                    ? "text-pink-600 border-b-2 border-pink-500 scale-102"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Heart size={16} className={activeTab === "matches" ? "fill-current" : ""} />
                <span>Mutual Matches</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-normal transition-colors ${
                  activeTab === "matches" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {matches?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("liked")}
                className={`relative flex items-center space-x-2 pb-4 text-sm font-extrabold tracking-wide outline-none transition-all ${
                  activeTab === "liked"
                    ? "text-pink-600 border-b-2 border-pink-500 scale-102"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Sparkles size={16} className={activeTab === "liked" ? "fill-current text-pink-500 animate-pulse" : ""} />
                <span>People I Liked</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-normal transition-colors ${
                  activeTab === "liked" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {likedUsers?.length || 0}
                </span>
              </button>
            </div>

            {activeTab === "matches" ? (
              isLoadingMyMatches ? (
                <div className="flex h-96 items-center justify-center">
                  <Loader className="animate-spin text-pink-500" size={40} />
                </div>
              ) : matches?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-96 flex-col items-center justify-center rounded-3xl border border-pink-100 bg-white/60 p-8 text-center shadow-xl backdrop-blur-sm"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow-inner">
                    <Flame size={36} className="fill-current animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-800">
                    No Matches Yet
                  </h2>
                  <p className="max-w-xs text-sm text-gray-500 mt-2 leading-relaxed">
                    Keep swiping in the feed or explore specific vibes! Your perfect match is waiting out there.
                  </p>
                  <Link
                    to="/"
                    className="mt-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  >
                    Start Swiping
                  </Link>
                </motion.div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {matches.map((match, idx) => (
                    <motion.div
                      key={match._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="group relative overflow-hidden rounded-3xl border border-white bg-white shadow-md hover:shadow-xl transition-all"
                    >
                      <div className="relative h-60 overflow-hidden">
                        <img
                          src={match.image || "/avatar.png"}
                          alt={match.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-xl font-extrabold tracking-wide">
                            {match.name},{" "}
                            <span className="font-semibold">{match.age}</span>
                          </h3>
                          <p className="text-xs text-pink-300 font-bold tracking-widest uppercase mt-0.5">
                            Mutual Match
                          </p>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed h-8">
                          {match.bio || "No bio available."}
                        </p>

                        <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
                          {match.interests?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-pink-50 border border-pink-100/60 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-pink-600 shadow-sm shrink-0"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          to={`/chat/${match._id}`}
                          className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 py-3 text-xs font-bold text-white shadow-md transition-transform active:scale-[0.97]"
                        >
                          <MessageCircle size={15} />
                          <span>Message Now</span>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              isLoadingLikedUsers ? (
                <div className="flex h-96 items-center justify-center">
                  <Loader className="animate-spin text-pink-500" size={40} />
                </div>
              ) : likedUsers?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-96 flex-col items-center justify-center rounded-3xl border border-pink-100 bg-white/60 p-8 text-center shadow-xl backdrop-blur-sm"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow-inner">
                    <Sparkles size={36} className="fill-current text-pink-500 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-800">
                    No Swipes Yet
                  </h2>
                  <p className="max-w-xs text-sm text-gray-500 mt-2 leading-relaxed">
                    Swipe right on profiles you find interesting. Once they like you back, they will appear in Mutual Matches!
                  </p>
                  <Link
                    to="/"
                    className="mt-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  >
                    Start Swiping
                  </Link>
                </motion.div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {likedUsers.map((liked, idx) => (
                    <motion.div
                      key={liked._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="group relative overflow-hidden rounded-3xl border border-white bg-white shadow-md hover:shadow-xl transition-all"
                    >
                      <div className="relative h-60 overflow-hidden">
                        <img
                          src={liked.image || "/avatar.png"}
                          alt={liked.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-xl font-extrabold tracking-wide">
                            {liked.name},{" "}
                            <span className="font-semibold">{liked.age}</span>
                          </h3>
                          <p className="text-xs text-yellow-300 font-bold tracking-widest uppercase mt-0.5 flex items-center space-x-1">
                            <Sparkles size={11} className="fill-current text-yellow-300" />
                            <span>Sent Like</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed h-8">
                          {liked.bio || "No bio available."}
                        </p>

                        <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
                          {liked.interests?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-pink-50 border border-pink-100/60 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-pink-600 shadow-sm shrink-0"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-gray-50 border border-gray-100/80 py-3 text-xs font-bold text-gray-400 select-none">
                          <Clock size={14} className="stroke-[2.5]" />
                          <span>Waiting for Match...</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
