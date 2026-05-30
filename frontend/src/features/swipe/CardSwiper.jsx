import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Frown,
  X,
  Heart,
  RotateCcw,
  Info,
  ChevronDown,
  RefreshCw,
  Star,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuthStore } from "../../store/useAuthStore";
import CompatibilityRadar from "../explore/CompatibilityRadar";
import LoadingState from "../../components/common/LoadingState";
import FallbackState from "../../components/common/FallbackState";

export default function CardSwiper({
  userProfiles,
  isLoadingUserProfiles,
  onRefresh,
  onSwipeLeft,
  onSwipeRight,
  onSwipeSuperLike,
  onRewind,
}) {
  const { authUser } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(
    x,
    [-200, -150, 0, 150, 200],
    [0.6, 1, 1, 1, 0.6],
  );

  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleSwipe = async (direction, user) => {
    setIsExpanded(false);
    if (direction === "right") {
      const data = await onSwipeRight(user);
      if (data && data.isMatch) {
        triggerConfetti(0.25, 0.5);
      }
    } else if (direction === "left") {
      await onSwipeLeft(user);
    } else if (direction === "super") {
      const data = await onSwipeSuperLike(user);
      triggerConfetti(0.5, 0.9);
      if (data && data.isMatch) {
        triggerConfetti(0.25, 0.5);
      }
    }
    x.set(0);
  };

  const handleBtnSwipe = async (direction) => {
    if (userProfiles.length === 0) return;
    const user = userProfiles[0];
    await handleSwipe(direction, user);
  };

  const handleRewindBtn = async () => {
    setIsExpanded(false);
    await onRewind();
  };

  const triggerConfetti = (scalar, durationMultiplier) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#f43f5e", "#ec4899", "#d946ef", "#eab308"],
      scalar,
      duration: 3000 * durationMultiplier,
    });
  };

  const activeProfile = userProfiles[0];
  const nextProfile = userProfiles[1];

  if (isLoadingUserProfiles) {
    return <LoadingState type="card" />;
  }

  if (userProfiles.length === 0) {
    return (
      <FallbackState
        icon={Frown}
        title="Speedy fingers!"
        description="You've swiped through all available profiles in your preferences. Maybe it's time to take a break and touch some grass!"
        actions={[
          {
            label: "Undo Last Swipe",
            onClick: handleRewindBtn,
            variant: "secondary",
            icon: RotateCcw,
          },
          {
            label: "Load Profiles",
            onClick: onRefresh,
            variant: "primary",
            icon: RefreshCw,
          },
        ]}
      />
    );
  }

  return (
    <div className="relative flex h-[32rem] w-full max-w-sm flex-col items-center justify-between select-none">
      <div className="relative h-[27rem] w-full">
        <AnimatePresence>
          {nextProfile && (
            <div
              key={nextProfile._id}
              className="absolute inset-0 z-0 origin-bottom scale-95 transform overflow-hidden rounded-3xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md pointer-events-none opacity-80 transition-all duration-300"
            >
              <img
                src={nextProfile.image || "/avatar.png"}
                alt={nextProfile.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold font-outfit">
                  {nextProfile.name},{" "}
                  <span className="font-semibold">{nextProfile.age}</span>
                </h3>
              </div>
            </div>
          )}

          {activeProfile && (
            <motion.div
              key={activeProfile._id}
              drag={isExpanded ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              style={{ x, rotate, opacity }}
              whileDrag={{ scale: 1.02 }}
              onDragEnd={async (e, info) => {
                if (isExpanded) return;
                const swipeThreshold = 130;
                if (info.offset.x > swipeThreshold) {
                  await handleSwipe("right", activeProfile);
                } else if (info.offset.x < -swipeThreshold) {
                  await handleSwipe("left", activeProfile);
                }
              }}
              className={`absolute inset-0 z-10 cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 shadow-xl transition-transform duration-75 border-4 ${
                activeProfile.isSuperLikedByTarget
                  ? "border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.3)]"
                  : "border-white dark:border-zinc-800"
              }`}
            >
              {!isExpanded && (
                <>
                  <motion.div
                    style={{ opacity: likeOpacity }}
                    className="absolute left-6 top-8 z-30 -rotate-12 rounded-xl border-4 border-green-500 bg-white/95 dark:bg-zinc-900/95 px-4 py-1.5 text-2xl font-black tracking-widest text-green-500 font-outfit"
                  >
                    LIKE
                  </motion.div>
                  <motion.div
                    style={{ opacity: nopeOpacity }}
                    className="absolute right-6 top-8 z-30 rotate-12 rounded-xl border-4 border-red-500 bg-white/95 dark:bg-zinc-900/95 px-4 py-1.5 text-2xl font-black tracking-widest text-red-500 font-outfit"
                  >
                    NOPE
                  </motion.div>
                </>
              )}

              <img
                src={activeProfile.image || "/avatar.png"}
                alt={activeProfile.name}
                className="h-full w-full object-cover select-none pointer-events-none"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/20 to-transparent pointer-events-none" />

              {activeProfile.isSuperLikedByTarget && (
                <div className="absolute top-6 left-6 z-20 flex items-center space-x-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                  <Star size={12} className="fill-current animate-spin" />
                  <span>Super Liked You!</span>
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col z-20">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-black tracking-wide font-outfit">
                      {activeProfile.name}
                    </h2>
                    <span className="text-2xl font-semibold opacity-90 font-outfit">
                      {activeProfile.age}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(true);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-sm pointer-events-auto"
                    aria-label="View full details"
                  >
                    <Info size={18} className="stroke-[2.5]" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-slate-200 line-clamp-2 leading-relaxed font-medium">
                  {activeProfile.bio || "No bio available."}
                </p>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{
                      type: "spring",
                      damping: 30,
                      stiffness: 250,
                    }}
                    className="absolute inset-x-0 bottom-0 z-40 h-[68%] rounded-t-3xl bg-white dark:bg-zinc-900 p-5 border-t border-slate-100 dark:border-zinc-800 shadow-2xl flex flex-col justify-between text-slate-800 dark:text-slate-100"
                  >
                    <div className="flex items-start justify-between select-none shrink-0 pb-1.5">
                      <div>
                        <h3 className="text-2xl font-black text-slate-805 dark:text-slate-100 font-outfit">
                          {activeProfile.name},{" "}
                          <span className="font-semibold">
                            {activeProfile.age}
                          </span>
                        </h3>
                        <p className="text-xs text-pink-500 dark:text-pink-400 font-bold capitalize mt-0.5">
                          {activeProfile.gender} • interested in{" "}
                          {activeProfile.genderPreference}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(false);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-505 dark:text-slate-400 transition-colors"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>

                    {/* Scrolling strictly bound internally with hidden bar */}
                    <div className="flex-grow overflow-y-auto my-3 space-y-4 pr-1 text-left select-none scrollbar-none">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          About Me
                        </h4>
                        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {activeProfile.bio || "No bio available."}
                        </p>
                      </div>

                      <CompatibilityRadar profile={activeProfile} />

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                          Interests
                        </h4>
                        {activeProfile.interests &&
                        activeProfile.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {activeProfile.interests.map((interest) => {
                              const isShared =
                                authUser?.interests?.includes(interest);
                              return (
                                <span
                                  key={interest}
                                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all ${
                                    isShared
                                      ? "bg-pink-500/10 dark:bg-pink-500/15 border-pink-205 dark:border-pink-900/50 text-pink-600 dark:text-pink-400 shadow-sm"
                                      : "bg-slate-50 dark:bg-zinc-950/60 border-slate-200/60 dark:border-zinc-800/80 text-slate-500 dark:text-slate-400"
                                  }`}
                                >
                                  {interest} {isShared && "✨"}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 dark:text-slate-500 italic font-medium">
                            No interests listed yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex w-full justify-center items-center space-x-3.5 pb-2 z-20 shrink-0">
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleBtnSwipe("left")}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-red-500 shadow-md hover:bg-slate-50 dark:hover:bg-zinc-800/60 focus:outline-none transition-colors"
          aria-label="Swipe Left (Dislike)"
        >
          <X size={26} className="stroke-[3]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRewindBtn}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-yellow-500 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800/60 focus:outline-none transition-colors"
          aria-label="Rewind last swipe"
        >
          <RotateCcw size={20} className="stroke-[2.5]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleBtnSwipe("super")}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-blue-500 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800/60 focus:outline-none transition-colors"
          aria-label="Super Like"
        >
          <Star size={20} className="fill-current stroke-[2.5]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleBtnSwipe("right")}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-green-500 shadow-md hover:bg-slate-50 dark:hover:bg-zinc-800/60 focus:outline-none transition-colors"
          aria-label="Swipe Right (Like)"
        >
          <Heart size={26} className="fill-current stroke-[2]" />
        </motion.button>
      </div>
    </div>
  );
}
