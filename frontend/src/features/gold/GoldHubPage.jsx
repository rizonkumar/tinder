import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useUserStore } from "../../store/useUserStore";
import { useMatchStore } from "../../store/useMatchStore";
import { Header } from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import {
  Crown,
  Sparkles,
  Heart,
  X,
  Lock,
  Unlock,
  Check,
  BarChart3,
  Percent,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { MOCK_LIKES } from "../../constants";
import LoadingState from "../../components/common/LoadingState";

export default function GoldHubPage() {
  const { authUser } = useAuthStore();
  const {
    toggleGold,
    toggleIncognito,
    getSwipeStats,
    swipeStats,
    getWhoLikedMe,
    whoLikedMe,
    isLoadingWhoLikedMe,
    isLoadingStats,
  } = useUserStore();
  const { swipeRight, swipeLeft } = useMatchStore();

  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => {
    getSwipeStats();
    getWhoLikedMe();
  }, [getSwipeStats, getWhoLikedMe]);

  const handleToggleGold = async () => {
    const updated = await toggleGold();
    if (updated && updated.isGold) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#f59e0b", "#d97706", "#ffffff"],
      });
      getWhoLikedMe();
    }
  };

  const handleToggleIncognito = async () => {
    if (!authUser?.isGold) return;
    await toggleIncognito();
  };

  const handleAction = async (e, profile, action) => {
    e.stopPropagation();
    if (!authUser?.isGold) {
      handleToggleGold();
      return;
    }

    if (action === "like") {
      await swipeRight(profile);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#f43f5e", "#ec4899", "#d946ef", "#fbbf24"],
      });
    } else {
      await swipeLeft(profile);
    }
    getWhoLikedMe();
    getSwipeStats();
  };

  const currentLikes = whoLikedMe?.length > 0 ? whoLikedMe : MOCK_LIKES;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 font-sans">
      <Sidebar />
      <div className="flex flex-grow flex-col h-full overflow-hidden bg-slate-50/20 dark:bg-transparent text-slate-800 dark:text-slate-100">
        <Header />

        {/* Scrolling strictly bound internally */}
        <main className="flex-grow overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 h-[calc(100vh-72px)] scrollbar-none">
          <div className="mx-auto max-w-4xl space-y-6 select-none">
            <div className="flex flex-col items-center text-center space-y-4 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-30px] left-[-30px] w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 p-3 shadow-md shadow-amber-500/10"
              >
                <Crown size={28} className="text-white fill-current" />
              </motion.div>

              <div>
                <h1 className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 bg-clip-text text-2xl sm:text-3xl font-black tracking-wider text-transparent uppercase font-outfit">
                  Swipe Gold
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
                  Unlock the full power of swiping. See who liked you, toggle incognito mode, and track your performance stats!
                </p>
              </div>

              <div className="flex items-center space-x-2 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 px-3.5 py-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 shadow-sm">
                <Sparkles size={11} className="fill-current animate-spin-slow" />
                <span>
                  {authUser?.isGold ? "SWIPE GOLD ACTIVE" : "UPGRADE TO GOLD"}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleGold}
                className={`relative overflow-hidden rounded-full font-bold text-xs transition-all shadow-md px-7 py-3 flex items-center justify-center space-x-2 focus:outline-none ${
                  authUser?.isGold
                    ? "bg-white dark:bg-zinc-900 border border-red-200/60 dark:border-red-950/30 hover:bg-red-50/50 dark:hover:bg-red-950/10 text-red-500 dark:text-red-400"
                    : "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white shadow-amber-500/15"
                }`}
              >
                {authUser?.isGold ? (
                  <>
                    <X size={14} className="stroke-[2.5]" />
                    <span>Cancel Gold Membership</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} className="fill-current" />
                    <span>Activate Swipe Gold</span>
                  </>
                )}
              </motion.button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 p-5 flex flex-col justify-between shadow-sm relative group">
                <div className="absolute top-4 right-4 text-slate-200 dark:text-slate-800 group-hover:text-amber-500/10 transition-all">
                  {authUser?.isGold ? <Unlock size={36} /> : <Lock size={36} />}
                </div>

                <div className="space-y-3.5 pr-12">
                  <div className="flex items-center space-x-2 text-amber-500 font-bold tracking-wide text-[10px] uppercase">
                    <Shield size={14} />
                    <span>Privacy Mode</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 font-outfit uppercase">Incognito Mode</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Make your profile visible <span className="text-amber-500 font-bold">only</span> to users you swipe right on. Browse swipe lists completely unseen.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                      Current Status
                    </span>
                    <span className={`text-xs font-bold mt-0.5 ${
                      authUser?.isGold && authUser?.incognitoMode ? "text-amber-500" : "text-slate-400 dark:text-slate-500"
                    }`}>
                      {authUser?.isGold
                        ? authUser?.incognitoMode ? "Activated" : "Deactivated"
                        : "Locked"}
                    </span>
                  </div>

                  <button
                    disabled={!authUser?.isGold}
                    onClick={handleToggleIncognito}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      authUser?.incognitoMode && authUser?.isGold ? "bg-amber-500" : "bg-slate-205 dark:bg-zinc-800"
                    } ${!authUser?.isGold ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        authUser?.incognitoMode && authUser?.isGold ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 p-5 flex flex-col justify-between shadow-sm relative">
                <div className="space-y-3.5">
                  <div className="flex items-center space-x-2 text-amber-500 font-bold tracking-wide text-[10px] uppercase">
                    <BarChart3 size={14} />
                    <span>Activity Stats</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 font-outfit uppercase">Swipe Statistics</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Check out your swipe velocity, match conversions, and count of profiles who showed interest.
                  </p>
                </div>

                {isLoadingStats ? (
                  <LoadingState message="" type="inline" />
                ) : (
                  <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-zinc-800 pt-5">
                    <div className="flex flex-col text-center bg-slate-50/50 dark:bg-zinc-950/20 border border-slate-200/60 dark:border-zinc-800/40 rounded-2xl p-2 shadow-inner">
                      <Users size={15} className="text-slate-400 dark:text-slate-500 mx-auto" />
                      <span className="text-base font-black mt-1 text-slate-800 dark:text-slate-200">
                        {swipeStats?.totalSwipes || 0}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                        Swipes
                      </span>
                    </div>

                    <div className="flex flex-col text-center bg-amber-50/20 dark:bg-amber-950/10 border border-amber-100/30 dark:border-amber-900/20 rounded-2xl p-2 shadow-inner">
                      <Heart size={15} className="text-amber-500 mx-auto fill-current animate-pulse" />
                      <span className="text-base font-black mt-1 text-amber-600 dark:text-amber-400">
                        {swipeStats?.likesReceived || 0}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-amber-500 tracking-wider">
                        Likes
                      </span>
                    </div>

                    <div className="flex flex-col text-center bg-orange-50/20 dark:bg-orange-950/10 border border-orange-100/30 dark:border-orange-900/20 rounded-2xl p-2 shadow-inner">
                      <Percent size={15} className="text-orange-500 mx-auto" />
                      <span className="text-base font-black mt-1 text-orange-600 dark:text-orange-400">
                        {swipeStats?.matchRate || 0}%
                      </span>
                      <span className="text-[9px] font-bold uppercase text-orange-500 tracking-wider">
                        Rate
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="rounded-xl bg-amber-500/10 dark:bg-amber-500/20 p-2 text-amber-500 dark:text-amber-400">
                    <Heart size={18} className="fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-wide text-slate-800 dark:text-slate-100 font-outfit uppercase">
                      Who Liked You
                    </h2>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                      Mutual matches will form immediately once you like them back!
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-sm">
                  {currentLikes.length} Profiles
                </span>
              </div>

              {isLoadingWhoLikedMe ? (
                <LoadingState message="Fetching likes feed..." type="large" />
              ) : (
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-3">
                  {currentLikes.map((profile, idx) => (
                    <motion.div
                      key={profile._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => authUser?.isGold && setActiveProfile(profile)}
                      className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                        authUser?.isGold
                          ? "cursor-pointer border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-amber-300/40 dark:hover:border-amber-500/30 hover:-translate-y-1"
                          : "border-slate-200/40 dark:border-zinc-800/40 bg-white/40 dark:bg-zinc-900/10 shadow-sm cursor-default"
                      }`}
                    >
                      <div className="relative h-60 overflow-hidden select-none">
                        <img
                          src={profile.image || "/avatar.png"}
                          alt={profile.name}
                          className={`h-full w-full object-cover transition-transform duration-550 group-hover:scale-102 ${
                            !authUser?.isGold ? "blur-2xl opacity-60 scale-102" : ""
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/10 to-transparent" />

                        {!authUser?.isGold && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/30 dark:bg-slate-950/60 backdrop-blur-md select-none">
                            <div className="rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 p-2.5 text-white shadow-md animate-pulse">
                              <Crown size={20} className="fill-current" />
                            </div>
                            <span className="mt-3 text-[9px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full shadow-sm">
                              Unlock Gold
                            </span>
                          </div>
                        )}

                        {authUser?.isGold && (
                          <div className="absolute top-3 right-3 rounded-full bg-yellow-400/90 p-1 text-white shadow-md">
                            <Crown size={12} className="fill-current" />
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          {authUser?.isGold ? (
                            <>
                              <h3 className="text-lg font-black tracking-wide font-outfit">
                                {profile.name},{" "}
                                <span className="font-semibold">{profile.age}</span>
                              </h3>
                              <div className="text-[9px] text-yellow-355 font-bold tracking-widest uppercase mt-0.5 flex items-center space-x-1">
                                <Sparkles size={10} className="fill-current text-yellow-300" />
                                <span>Liked you!</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <h3 className="text-lg font-black tracking-wide text-slate-200 font-outfit">
                                Swipe User, <span className="font-semibold">??</span>
                              </h3>
                              <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                                Blurred profile
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {authUser?.isGold && (
                        <div className="flex w-full justify-around items-center border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/30 py-3 backdrop-blur-md">
                          <button
                            onClick={(e) => handleAction(e, profile, "dislike")}
                            className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 border border-slate-200/60 dark:border-zinc-800 shadow-sm transition-all active:scale-90 hover:scale-105"
                          >
                            <X size={14} className="stroke-[3]" />
                          </button>
                          <button
                            onClick={(e) => handleAction(e, profile, "like")}
                            className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white shadow-md transition-all active:scale-90 hover:scale-105"
                          >
                            <Heart size={14} className="fill-current" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {activeProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProfile(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-905 text-slate-800 dark:text-slate-100 shadow-2xl"
            >
              <button
                onClick={() => setActiveProfile(null)}
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="relative h-72">
                <img
                  src={activeProfile.image || "/avatar.png"}
                  alt={activeProfile.name}
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-slate-850 dark:text-slate-100">
                  <h2 className="text-2xl font-black font-outfit">
                    {activeProfile.name},{" "}
                    <span className="font-semibold">{activeProfile.age}</span>
                  </h2>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold tracking-widest uppercase mt-0.5 flex items-center space-x-1">
                    <Sparkles size={11} className="fill-current animate-bounce" />
                    <span>Loves Your Vibe!</span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">
                    Bio
                  </h4>
                  <p className="mt-1.5 text-sm text-slate-655 dark:text-slate-300 leading-relaxed font-medium">
                    {activeProfile.bio || "No bio available."}
                  </p>
                </div>

                {activeProfile.interests && activeProfile.interests.length > 0 && (
                  <div>
                    <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555 mb-2">
                      Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProfile.interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full bg-pink-50 dark:bg-pink-950/20 border border-pink-100/40 dark:border-pink-900/30 px-3 py-1 text-xs font-bold text-pink-600 dark:text-pink-400"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3.5 pt-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      handleAction(e, activeProfile, "dislike");
                      setActiveProfile(null);
                    }}
                    className="flex flex-1 items-center justify-center space-x-1.5 rounded-2xl border border-slate-205 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/60 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 transition-colors focus:outline-none"
                  >
                    <X size={14} className="stroke-[2.5]" />
                    <span>Pass</span>
                  </button>
                  <button
                    onClick={(e) => {
                      handleAction(e, activeProfile, "like");
                      setActiveProfile(null);
                    }}
                    className="flex flex-1 items-center justify-center space-x-1.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 py-3 text-xs font-black text-white shadow-md active:scale-[0.97] transition-all focus:outline-none"
                  >
                    <Check size={14} className="stroke-[3]" />
                    <span>Like Back</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
