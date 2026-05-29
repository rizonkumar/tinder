import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useMatchStore } from "../store/useMatchStore";
import { Header } from "../components/Header";
import Sidebar from "../components/Sidebar";
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
  Loader,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const MOCK_LIKES = [
  {
    _id: "mock1",
    name: "Aadhya",
    age: 24,
    bio: "Tea enthusiast | Coding & coffee geek | Explorer",
    image: "/female/1.jpg",
    interests: ["Coding", "Travel", "Music"],
  },
  {
    _id: "mock2",
    name: "Saanvi",
    age: 22,
    bio: "Art curator • Weekend explorer • Dog lover",
    image: "/female/2.jpg",
    interests: ["Art", "Reading", "Yoga"],
  },
  {
    _id: "mock3",
    name: "Reyansh",
    age: 27,
    bio: "Fitness geek and food lover. Let's explore street food!",
    image: "/male/1.jpg",
    interests: ["Fitness", "Food", "Cricket"],
  },
];

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
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 lg:flex-row">
      <Sidebar />
      <div className="flex flex-grow flex-col overflow-hidden bg-white/40 backdrop-blur-sm lg:w-3/4 text-gray-800">
        <Header />

        <main className="flex-grow overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-8 select-none">
            <div className="flex flex-col items-center text-center space-y-5 rounded-3xl bg-white/80 border border-pink-100/60 p-6 sm:p-10 shadow-xl shadow-pink-500/5 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-30px] left-[-30px] w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 p-4 shadow-lg shadow-amber-500/20"
              >
                <Crown size={32} className="text-white fill-current animate-pulse" />
              </motion.div>

              <div>
                <h1 className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 bg-clip-text text-3xl sm:text-4xl font-black tracking-wider text-transparent uppercase font-serif">
                  Swipe Gold
                </h1>
                <p className="mt-1.5 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                  Unlock the full power of swiping. See who liked you, toggle incognito mode, and track your performance stats!
                </p>
              </div>

              <div className="flex items-center space-x-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-xs font-black text-amber-600 shadow-sm">
                <Sparkles size={13} className="fill-current animate-spin-slow" />
                <span>
                  {authUser?.isGold ? "SWIPE GOLD ACTIVE" : "UPGRADE TO GOLD"}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleGold}
                className={`relative overflow-hidden rounded-full font-extrabold text-sm transition-all shadow-lg px-8 py-3.5 flex items-center justify-center space-x-2 ${
                  authUser?.isGold
                    ? "bg-white border border-red-200 hover:bg-red-50 text-red-500 shadow-md shadow-red-500/5"
                    : "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white shadow-amber-500/25 hover:shadow-amber-500/35"
                }`}
              >
                {authUser?.isGold ? (
                  <>
                    <X size={16} />
                    <span>Cancel Gold Membership</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} className="fill-current" />
                    <span>Activate Swipe Gold</span>
                  </>
                )}
              </motion.button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white/80 border border-pink-100 p-6 flex flex-col justify-between backdrop-blur-md shadow-md shadow-pink-500/5 hover:border-amber-300/40 transition-all duration-300 relative group">
                <div className="absolute top-4 right-4 text-gray-200 group-hover:text-amber-500/20 transition-all">
                  {authUser?.isGold ? <Unlock size={44} /> : <Lock size={44} />}
                </div>

                <div className="space-y-4 pr-12">
                  <div className="flex items-center space-x-2 text-amber-500 font-black tracking-wide text-[10px] uppercase">
                    <Shield size={14} />
                    <span>Privacy Mode</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-800">Incognito Mode</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Make your profile visible <span className="text-amber-500 font-semibold">only</span> to users you swipe right on. Browse swipe lists completely unseen.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-pink-50 pt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">
                      Current Status
                    </span>
                    <span className={`text-sm font-extrabold mt-0.5 ${
                      authUser?.isGold && authUser?.incognitoMode ? "text-amber-500" : "text-gray-400"
                    }`}>
                      {authUser?.isGold
                        ? authUser?.incognitoMode ? "Activated" : "Deactivated"
                        : "Locked"}
                    </span>
                  </div>

                  <button
                    disabled={!authUser?.isGold}
                    onClick={handleToggleIncognito}
                    className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      authUser?.incognitoMode && authUser?.isGold ? "bg-amber-500" : "bg-gray-200"
                    } ${!authUser?.isGold ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        authUser?.incognitoMode && authUser?.isGold ? "translate-x-5.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="rounded-3xl bg-white/80 border border-pink-100 p-6 flex flex-col justify-between backdrop-blur-md shadow-md shadow-pink-500/5 hover:border-amber-300/40 transition-all duration-300 relative">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-amber-500 font-black tracking-wide text-[10px] uppercase">
                    <BarChart3 size={14} />
                    <span>Activity Stats</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-800">Swipe Statistics</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Check out your swipe velocity, match conversions, and count of profiles who showed interest.
                  </p>
                </div>

                {isLoadingStats ? (
                  <div className="flex h-24 items-center justify-center">
                    <Loader className="animate-spin text-amber-500" size={24} />
                  </div>
                ) : (
                  <div className="mt-8 grid grid-cols-3 gap-3 border-t border-pink-50 pt-6">
                    <div className="flex flex-col text-center bg-gray-50/70 border border-pink-100/50 rounded-2xl p-2.5 shadow-inner">
                      <Users size={16} className="text-gray-400 mx-auto" />
                      <span className="text-lg font-black mt-1 text-gray-800">
                        {swipeStats?.totalSwipes || 0}
                      </span>
                      <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">
                        Swipes
                      </span>
                    </div>

                    <div className="flex flex-col text-center bg-amber-50/40 border border-amber-100 rounded-2xl p-2.5 shadow-inner">
                      <Heart size={16} className="text-amber-500 mx-auto fill-current animate-pulse" />
                      <span className="text-lg font-black mt-1 text-amber-600">
                        {swipeStats?.likesReceived || 0}
                      </span>
                      <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">
                        Likes
                      </span>
                    </div>

                    <div className="flex flex-col text-center bg-orange-50/40 border border-orange-100 rounded-2xl p-2.5 shadow-inner">
                      <Percent size={16} className="text-orange-500 mx-auto" />
                      <span className="text-lg font-black mt-1 text-orange-600">
                        {swipeStats?.matchRate || 0}%
                      </span>
                      <span className="text-[9px] font-black uppercase text-orange-500 tracking-wider">
                        Rate
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-pink-100 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 p-2.5 text-white shadow-md shadow-amber-500/10">
                    <Heart size={18} className="fill-current" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-wide text-gray-800">
                      Who Liked You
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Mutual matches will form immediately once you like them back!
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-black text-amber-600 shadow-sm">
                  {currentLikes.length} Profiles
                </span>
              </div>

              {isLoadingWhoLikedMe ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader className="animate-spin text-amber-500" size={32} />
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-3">
                  {currentLikes.map((profile, idx) => (
                    <motion.div
                      key={profile._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => authUser?.isGold && setActiveProfile(profile)}
                      className={`group relative overflow-hidden rounded-3xl border transition-all ${
                        authUser?.isGold
                          ? "cursor-pointer border-pink-100 bg-white shadow-md hover:shadow-xl hover:border-amber-300/60 hover:-translate-y-1"
                          : "border-pink-100/80 bg-white/40 shadow-sm cursor-default"
                      }`}
                    >
                      <div className="relative h-60 overflow-hidden select-none">
                        <img
                          src={profile.image || "/avatar.png"}
                          alt={profile.name}
                          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-103 ${
                            !authUser?.isGold ? "blur-2xl opacity-60 scale-102" : ""
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                        {!authUser?.isGold && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900/10 backdrop-blur-[2px] select-none">
                            <div className="rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 p-3 text-white shadow-lg animate-pulse">
                              <Crown size={22} className="fill-current" />
                            </div>
                            <span className="mt-3 text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-full shadow-sm">
                              Unlock Gold
                            </span>
                          </div>
                        )}

                        {authUser?.isGold && (
                          <div className="absolute top-3 right-3 rounded-full bg-yellow-400/90 p-1.5 text-white shadow-md border border-yellow-300/40">
                            <Crown size={12} className="fill-current" />
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          {authUser?.isGold ? (
                            <>
                              <h3 className="text-lg font-black tracking-wide">
                                {profile.name},{" "}
                                <span className="font-semibold">{profile.age}</span>
                              </h3>
                              <p className="text-[9px] text-yellow-300 font-extrabold tracking-widest uppercase mt-0.5 flex items-center space-x-1">
                                <Sparkles size={10} className="fill-current text-yellow-300" />
                                <span>Liked you!</span>
                              </p>
                            </>
                          ) : (
                            <>
                              <h3 className="text-lg font-black tracking-wide text-gray-200">
                                Swipe User, <span className="font-semibold">??</span>
                              </h3>
                              <p className="text-[9px] text-gray-400 font-extrabold tracking-widest uppercase mt-0.5">
                                Blurred profile
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {authUser?.isGold && (
                        <div className="flex w-full justify-around items-center border-t border-pink-50 bg-gray-50/50 py-3.5 backdrop-blur-md">
                          <button
                            onClick={(e) => handleAction(e, profile, "dislike")}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white hover:bg-red-50 text-red-500 border border-pink-100/60 shadow-md transition-all active:scale-90 hover:scale-105"
                          >
                            <X size={16} className="stroke-[3]" />
                          </button>
                          <button
                            onClick={(e) => handleAction(e, profile, "like")}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 transition-all active:scale-90 hover:scale-105"
                          >
                            <Heart size={16} className="fill-current" />
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-pink-100 bg-white/95 text-gray-800 shadow-2xl backdrop-blur-xl"
            >
              <button
                onClick={() => setActiveProfile(null)}
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="relative h-72">
                <img
                  src={activeProfile.image || "/avatar.png"}
                  alt={activeProfile.name}
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-gray-800">
                  <h2 className="text-2xl font-black">
                    {activeProfile.name},{" "}
                    <span className="font-semibold">{activeProfile.age}</span>
                  </h2>
                  <p className="text-[10px] text-amber-600 font-extrabold tracking-widest uppercase mt-0.5 flex items-center space-x-1">
                    <Sparkles size={11} className="fill-current animate-bounce" />
                    <span>Loves Your Vibe!</span>
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                    Bio
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {activeProfile.bio || "No bio available."}
                  </p>
                </div>

                {activeProfile.interests && activeProfile.interests.length > 0 && (
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">
                      Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProfile.interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full bg-pink-50 border border-pink-100/60 px-3 py-1.5 text-xs font-semibold text-pink-600"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 pt-2">
                  <button
                    onClick={(e) => {
                      handleAction(e, activeProfile, "dislike");
                      setActiveProfile(null);
                    }}
                    className="flex flex-1 items-center justify-center space-x-1.5 rounded-2xl border border-pink-100 hover:bg-gray-50 py-3.5 text-xs font-bold text-gray-500 transition-colors"
                  >
                    <X size={14} className="stroke-[2.5]" />
                    <span>Pass</span>
                  </button>
                  <button
                    onClick={(e) => {
                      handleAction(e, activeProfile, "like");
                      setActiveProfile(null);
                    }}
                    className="flex flex-1 items-center justify-center space-x-1.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 py-3.5 text-xs font-black text-white shadow-lg shadow-amber-500/20 active:scale-[0.97] transition-all"
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
