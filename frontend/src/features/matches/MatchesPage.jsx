import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import { useMatchStore } from "../../store/useMatchStore";
import { Heart, MessageCircle, Flame, Sparkles, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoadingState from "../../components/common/LoadingState";
import FallbackState from "../../components/common/FallbackState";

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
  const navigate = useNavigate();

  useEffect(() => {
    getMyMatches();
    getLikedUsers();
  }, [getMyMatches, getLikedUsers]);

  return (
    <AppLayout variant="scroll">
      <div className="space-y-8 select-none">
        <div className="flex items-center space-x-3.5">
              <div className="rounded-lg bg-green-100 border border-green-200 p-3 text-green-700">
                <Heart size={26} className="fill-current animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground font-outfit">
                  YOUR CONNECTIONS
                </h1>
                <p className="text-sm text-foreground-secondary mt-0.5 font-medium">
                  See mutual connections and profiles you liked!
                </p>
              </div>
            </div>

            <div className="flex w-full space-x-6 border-b border-border pb-px">
              <button
                onClick={() => setActiveTab("matches")}
                className="relative pb-4 text-sm font-semibold tracking-wide outline-none transition-all flex items-center space-x-2"
              >
                <span className={`flex items-center space-x-2 relative z-10 transition-colors duration-200 ${
                  activeTab === "matches" ? "text-accent" : "text-foreground-muted hover:text-foreground-secondary"
                }`}>
                  <Heart size={15} className={activeTab === "matches" ? "fill-current" : ""} />
                  <span className="font-outfit">Mutual Matches</span>
                  <span className="text-xs font-semibold text-foreground-muted">
                    {matches?.length || 0}
                  </span>
                </span>
                {activeTab === "matches" && (
                  <motion.div
                    layoutId="active_connections_tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab("liked")}
                className="relative pb-4 text-sm font-semibold tracking-wide outline-none transition-all flex items-center space-x-2"
              >
                <span className={`flex items-center space-x-2 relative z-10 transition-colors duration-200 ${
                  activeTab === "liked" ? "text-accent" : "text-foreground-muted hover:text-foreground-secondary"
                }`}>
                  <Sparkles size={15} className={activeTab === "liked" ? "fill-current text-accent" : ""} />
                  <span className="font-outfit">People I Liked</span>
                  <span className="text-xs font-semibold text-foreground-muted">
                    {likedUsers?.length || 0}
                  </span>
                </span>
                {activeTab === "liked" && (
                  <motion.div
                    layoutId="active_connections_tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "matches" ? (
                <motion.div
                  key="matches_panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {isLoadingMyMatches ? (
                    <div className="flex h-96 items-center justify-center">
                      <LoadingState message="Fetching connections..." />
                    </div>
                  ) : matches?.length === 0 ? (
                    <FallbackState
                      icon={Flame}
                      title="No Matches Yet"
                      description="Keep swiping in the feed or explore specific vibes! Your perfect match is waiting out there."
                      actions={[
                        {
                          label: "Start Swiping",
                          onClick: () => navigate("/"),
                          variant: "primary"
                        }
                      ]}
                      className="h-96 border border-border bg-background shadow-card rounded-lg"
                    />
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                      {matches.map((match, idx) => (
                        <motion.div
                          key={match._id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04, type: "spring", stiffness: 260, damping: 20 }}
                          whileHover={{ y: -6 }}
                          className="group relative overflow-hidden rounded-lg border border-border bg-background shadow-card transition-all duration-300 flex flex-col"
                        >
                          <div className="relative h-60 overflow-hidden shrink-0">
                            <img
                              src={match.image || "/avatar.png"}
                              alt={match.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-black/40" />
                            
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <h3 className="text-xl font-bold tracking-wide font-outfit">
                                {match.name},{" "}
                                <span className="font-semibold">{match.age}</span>
                              </h3>
                              <p className="text-xs text-green-100 font-bold tracking-wider uppercase mt-0.5 font-outfit">
                                Mutual Match
                              </p>
                            </div>
                          </div>

                          <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                            <p className="text-xs text-foreground-secondary line-clamp-2 leading-relaxed h-10 font-medium font-sans">
                              {match.bio || "No bio available."}
                            </p>

                            <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
                              {match.interests?.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-background-secondary border border-border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground-secondary shrink-0 font-outfit"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              onClick={() => navigate(`/chat/${match._id}`)}
                              className="flex w-full items-center justify-center space-x-2 rounded-md bg-primary hover:bg-primary-hover py-3 text-xs font-bold text-primary-foreground shadow-card transition-all duration-300 focus-ring"
                            >
                              <MessageCircle size={15} />
                              <span className="font-outfit">Message Now</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="liked_panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {isLoadingLikedUsers ? (
                    <div className="flex h-96 items-center justify-center">
                      <LoadingState message="Fetching your swipes..." />
                    </div>
                  ) : likedUsers?.length === 0 ? (
                    <FallbackState
                      icon={Sparkles}
                      title="No Swipes Yet"
                      description="Swipe right on profiles you find interesting. Once they like you back, they will appear in Mutual Matches!"
                      actions={[
                        {
                          label: "Start Swiping",
                          onClick: () => navigate("/"),
                          variant: "primary"
                        }
                      ]}
                      className="h-96 border border-border bg-background shadow-card rounded-lg"
                    />
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                      {likedUsers.map((liked, idx) => (
                        <motion.div
                          key={liked._id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04, type: "spring", stiffness: 260, damping: 20 }}
                          whileHover={{ y: -6 }}
                          className="group relative overflow-hidden rounded-lg border border-border bg-background shadow-card transition-all duration-300 flex flex-col"
                        >
                          <div className="relative h-60 overflow-hidden shrink-0">
                            <img
                              src={liked.image || "/avatar.png"}
                              alt={liked.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-black/40" />
                            
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <h3 className="text-xl font-bold tracking-wide font-outfit">
                                {liked.name},{" "}
                                <span className="font-semibold">{liked.age}</span>
                              </h3>
                              <div className="text-xs text-blue-100 font-bold tracking-wider uppercase mt-0.5 flex items-center space-x-1 font-outfit">
                                <Sparkles size={11} className="fill-current text-blue-100" />
                                <span>Sent Like</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                            <p className="text-xs text-foreground-secondary line-clamp-2 leading-relaxed h-10 font-medium font-sans">
                              {liked.bio || "No bio available."}
                            </p>

                            <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
                              {liked.interests?.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-background-secondary border border-border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground-secondary shrink-0 font-outfit"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex w-full items-center justify-center space-x-2 rounded-md bg-background-secondary border border-border py-3 text-xs font-bold text-foreground-muted select-none font-outfit">
                              <Clock size={14} className="stroke-[2.5]" />
                              <span>Waiting for Match...</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
