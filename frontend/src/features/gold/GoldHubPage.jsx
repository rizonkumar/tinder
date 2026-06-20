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
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-background transition-colors duration-300 font-sans">
      <Sidebar />
      <div className="flex flex-grow flex-col h-full overflow-hidden bg-background text-foreground">
        <Header />

        {/* Scrolling strictly bound internally */}
        <main className="flex-grow overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 h-[calc(100vh-72px)] scrollbar-none">
          <div className="mx-auto max-w-4xl space-y-6 select-none">
            <div className="flex flex-col items-center text-center space-y-4 rounded-3xl bg-background border border-border p-6 sm:p-8 shadow-card relative overflow-hidden">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl bg-amber-700 p-3 shadow-card"
              >
                <Crown size={28} className="text-white fill-current" />
              </motion.div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-foreground uppercase font-outfit">
                  Swipe Gold
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-foreground-secondary max-w-md mx-auto leading-relaxed font-medium">
                  Unlock the full power of swiping. See who liked you, toggle incognito mode, and track your performance stats!
                </p>
              </div>

              <div className="flex items-center space-x-2 rounded-full bg-amber-100 border border-border px-3.5 py-1.5 text-[10px] font-bold text-amber-900 shadow-card">
                <Sparkles size={11} className="fill-current animate-spin-slow" />
                <span>
                  {authUser?.isGold ? "SWIPE GOLD ACTIVE" : "UPGRADE TO GOLD"}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleGold}
                className={`relative overflow-hidden rounded-full font-bold text-xs transition-all shadow-card px-7 py-3 flex items-center justify-center space-x-2 focus-ring ${
                  authUser?.isGold
                    ? "bg-background border border-red-300 hover:bg-red-100 text-red-700"
                    : "bg-amber-700 text-white"
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
              <div className="rounded-3xl bg-background border border-border p-5 flex flex-col justify-between shadow-card relative group">
                <div className="absolute top-4 right-4 text-foreground-muted group-hover:text-amber-700 transition-all">
                  {authUser?.isGold ? <Unlock size={36} /> : <Lock size={36} />}
                </div>

                <div className="space-y-3.5 pr-12">
                  <div className="flex items-center space-x-2 text-amber-700 font-bold tracking-wide text-[10px] uppercase">
                    <Shield size={14} />
                    <span>Privacy Mode</span>
                  </div>
                  <h3 className="text-lg font-black text-foreground font-outfit uppercase">Incognito Mode</h3>
                  <p className="text-xs text-foreground-secondary leading-relaxed font-medium">
                    Make your profile visible <span className="text-amber-700 font-bold">only</span> to users you swipe right on. Browse swipe lists completely unseen.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-foreground-muted uppercase font-bold tracking-wider">
                      Current Status
                    </span>
                    <span className={`text-xs font-bold mt-0.5 ${
                      authUser?.isGold && authUser?.incognitoMode ? "text-amber-700" : "text-foreground-muted"
                    }`}>
                      {authUser?.isGold
                        ? authUser?.incognitoMode ? "Activated" : "Deactivated"
                        : "Locked"}
                    </span>
                  </div>

                  <button
                    disabled={!authUser?.isGold}
                    onClick={handleToggleIncognito}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring ${
                      authUser?.incognitoMode && authUser?.isGold ? "bg-amber-700" : "bg-surface-active"
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

              <div className="rounded-3xl bg-background border border-border p-5 flex flex-col justify-between shadow-card relative">
                <div className="space-y-3.5">
                  <div className="flex items-center space-x-2 text-amber-700 font-bold tracking-wide text-[10px] uppercase">
                    <BarChart3 size={14} />
                    <span>Activity Stats</span>
                  </div>
                  <h3 className="text-lg font-black text-foreground font-outfit uppercase">Swipe Statistics</h3>
                  <p className="text-xs text-foreground-secondary leading-relaxed font-medium">
                    Check out your swipe velocity, match conversions, and count of profiles who showed interest.
                  </p>
                </div>

                {isLoadingStats ? (
                  <LoadingState message="" type="inline" />
                ) : (
                  <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5">
                    <div className="flex flex-col text-center bg-background-secondary border border-border rounded-2xl p-2">
                      <Users size={15} className="text-foreground-muted mx-auto" />
                      <span className="text-base font-black mt-1 text-foreground">
                        {swipeStats?.totalSwipes || 0}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-foreground-muted tracking-wider">
                        Swipes
                      </span>
                    </div>

                    <div className="flex flex-col text-center bg-amber-100 border border-border rounded-2xl p-2">
                      <Heart size={15} className="text-amber-700 mx-auto fill-current animate-pulse" />
                      <span className="text-base font-black mt-1 text-amber-900">
                        {swipeStats?.likesReceived || 0}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-amber-700 tracking-wider">
                        Likes
                      </span>
                    </div>

                    <div className="flex flex-col text-center bg-background-secondary border border-border rounded-2xl p-2">
                      <Percent size={15} className="text-foreground-muted mx-auto" />
                      <span className="text-base font-black mt-1 text-foreground">
                        {swipeStats?.matchRate || 0}%
                      </span>
                      <span className="text-[9px] font-bold uppercase text-foreground-muted tracking-wider">
                        Rate
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                    <Heart size={18} className="fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-wide text-foreground font-outfit uppercase">
                      Who Liked You
                    </h2>
                    <p className="text-[11px] text-foreground-muted mt-0.5 font-medium">
                      Mutual matches will form immediately once you like them back!
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-100 border border-border px-3 py-1 text-xs font-bold text-amber-900 shadow-card">
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
                          ? "cursor-pointer border-border bg-background shadow-card hover:border-border-strong hover:-translate-y-1"
                          : "border-border bg-background shadow-card cursor-default"
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
                        <div className="absolute inset-0 bg-gray-1000/60" />

                        {!authUser?.isGold && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-1000/40 select-none">
                            <div className="rounded-full bg-amber-700 p-2.5 text-white shadow-card">
                              <Crown size={20} className="fill-current" />
                            </div>
                            <span className="mt-3 text-[9px] font-bold uppercase tracking-widest text-amber-900 bg-amber-100 border border-border px-2.5 py-1 rounded-full shadow-card">
                              Unlock Gold
                            </span>
                          </div>
                        )}

                        {authUser?.isGold && (
                          <div className="absolute top-3 right-3 rounded-full bg-amber-700 p-1 text-white shadow-card">
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
                              <div className="text-[9px] text-amber-300 font-bold tracking-widest uppercase mt-0.5 flex items-center space-x-1">
                                <Sparkles size={10} className="fill-current text-amber-300" />
                                <span>Liked you!</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <h3 className="text-lg font-black tracking-wide text-white font-outfit">
                                Swipe User, <span className="font-semibold">??</span>
                              </h3>
                              <p className="text-[9px] text-white/70 font-bold tracking-widest uppercase mt-0.5">
                                Blurred profile
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {authUser?.isGold && (
                        <div className="flex w-full justify-around items-center border-t border-border bg-background-secondary py-3">
                          <button
                            onClick={(e) => handleAction(e, profile, "dislike")}
                            className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-background hover:bg-red-100 text-red-600 border border-border shadow-card transition-all active:scale-90 hover:scale-105"
                          >
                            <X size={14} className="stroke-[3]" />
                          </button>
                          <button
                            onClick={(e) => handleAction(e, profile, "like")}
                            className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-amber-700 text-white shadow-card transition-all active:scale-90 hover:scale-105"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-background text-foreground shadow-modal"
            >
              <button
                onClick={() => setActiveProfile(null)}
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-hover hover:bg-surface-active text-foreground-secondary hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>

              <div className="relative h-72">
                <img
                  src={activeProfile.image || "/avatar.png"}
                  alt={activeProfile.name}
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-gray-1000/40" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <h2 className="text-2xl font-black font-outfit">
                    {activeProfile.name},{" "}
                    <span className="font-semibold">{activeProfile.age}</span>
                  </h2>
                  <div className="text-[10px] text-amber-300 font-bold tracking-widest uppercase mt-0.5 flex items-center space-x-1">
                    <Sparkles size={11} className="fill-current animate-bounce" />
                    <span>Loves Your Vibe!</span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <h4 className="text-[9px] font-bold uppercase tracking-wider text-foreground-muted">
                    Bio
                  </h4>
                  <p className="mt-1.5 text-sm text-foreground-secondary leading-relaxed font-medium">
                    {activeProfile.bio || "No bio available."}
                  </p>
                </div>

                {activeProfile.interests && activeProfile.interests.length > 0 && (
                  <div>
                    <h4 className="text-[9px] font-bold uppercase tracking-wider text-foreground-muted mb-2">
                      Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProfile.interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full bg-background-secondary border border-border px-3 py-1 text-xs font-bold text-foreground-secondary"
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
                    className="flex flex-1 items-center justify-center space-x-1.5 rounded-2xl border border-border hover:bg-surface-hover py-3 text-xs font-bold text-foreground-secondary transition-colors focus-ring"
                  >
                    <X size={14} className="stroke-[2.5]" />
                    <span>Pass</span>
                  </button>
                  <button
                    onClick={(e) => {
                      handleAction(e, activeProfile, "like");
                      setActiveProfile(null);
                    }}
                    className="flex flex-1 items-center justify-center space-x-1.5 rounded-2xl bg-amber-700 py-3 text-xs font-black text-white shadow-card active:scale-[0.97] transition-all focus-ring"
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
