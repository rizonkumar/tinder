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
  Leaf,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuthStore } from "../store/useAuthStore";

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
    return <LoadingUI />;
  }

  if (userProfiles.length === 0) {
    return <NoMoreProfiles onRefresh={onRefresh} onRewind={handleRewindBtn} />;
  }

  return (
    <div className="relative flex h-[32rem] w-full max-w-sm flex-col items-center justify-between">
      <div className="relative h-[27rem] w-full">
        <AnimatePresence>
          {nextProfile && (
            <div
              key={nextProfile._id}
              className="absolute inset-0 z-0 origin-bottom scale-95 transform overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg pointer-events-none opacity-80 transition-all duration-300"
            >
              <img
                src={nextProfile.image || "/avatar.png"}
                alt={nextProfile.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold">
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
              className={`absolute inset-0 z-10 cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl bg-white shadow-2xl transition-transform duration-75 border-4 ${
                activeProfile.isSuperLikedByTarget
                  ? "border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.35)]"
                  : "border-white"
              }`}
            >
              {!isExpanded && (
                <>
                  <motion.div
                    style={{ opacity: likeOpacity }}
                    className="absolute left-6 top-8 z-30 -rotate-12 rounded-lg border-4 border-green-500 bg-white/90 px-4 py-1.5 text-3xl font-extrabold tracking-widest text-green-500"
                  >
                    LIKE
                  </motion.div>
                  <motion.div
                    style={{ opacity: nopeOpacity }}
                    className="absolute right-6 top-8 z-30 rotate-12 rounded-lg border-4 border-red-500 bg-white/90 px-4 py-1.5 text-3xl font-extrabold tracking-widest text-red-500"
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

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

              {activeProfile.isSuperLikedByTarget && (
                <div className="absolute top-6 left-6 z-20 flex items-center space-x-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                  <Star size={12} className="fill-current animate-spin" />
                  <span>Super Liked You!</span>
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col z-20">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-extrabold tracking-wide">
                      {activeProfile.name}
                    </h2>
                    <span className="text-2xl font-medium opacity-90">
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
                <p className="mt-2 text-sm text-gray-200 line-clamp-2 leading-relaxed">
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
                    className="absolute inset-x-0 bottom-0 z-40 h-[65%] rounded-t-3xl bg-white/95 backdrop-blur-md p-6 border-t border-gray-100 shadow-2xl flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between select-none">
                      <div>
                        <h3 className="text-2xl font-extrabold text-gray-800">
                          {activeProfile.name},{" "}
                          <span className="font-semibold">
                            {activeProfile.age}
                          </span>
                        </h3>
                        <p className="text-xs text-pink-500 font-medium capitalize mt-0.5">
                          {activeProfile.gender} • interested in{" "}
                          {activeProfile.genderPreference}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(false);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>

                    <div className="flex-grow overflow-y-auto my-4 space-y-4 pr-1 text-left select-none">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          About Me
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                          {activeProfile.bio || "No bio available."}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
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
                                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all ${
                                    isShared
                                      ? "bg-pink-50 border-pink-300 text-pink-600 shadow-sm"
                                      : "bg-gray-50 border-gray-200 text-gray-500"
                                  }`}
                                >
                                  {interest} {isShared && "✨"}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">
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

      <div className="flex w-full justify-center items-center space-x-3 pb-2 z-20">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleBtnSwipe("left")}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-red-100 bg-white text-red-500 shadow-lg hover:bg-red-50 focus:outline-none"
          aria-label="Swipe Left (Dislike)"
        >
          <X size={26} className="stroke-[3]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRewindBtn}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-yellow-100 bg-white text-yellow-500 shadow-md hover:bg-yellow-50 focus:outline-none"
          aria-label="Rewind last swipe"
        >
          <RotateCcw size={20} className="stroke-[2.5]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleBtnSwipe("super")}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-500 shadow-md hover:bg-blue-50 focus:outline-none"
          aria-label="Super Like"
        >
          <Star size={20} className="fill-current stroke-[2.5]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleBtnSwipe("right")}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-green-100 bg-white text-green-500 shadow-lg hover:bg-green-50 focus:outline-none"
          aria-label="Swipe Right (Like)"
        >
          <Heart size={26} className="fill-current stroke-[2]" />
        </motion.button>
      </div>
    </div>
  );
}

function NoMoreProfiles({ onRefresh, onRewind }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center max-w-md select-none">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow-inner">
        <Frown size={50} />
      </div>
      <h2 className="mb-3 text-3xl font-extrabold text-gray-800 tracking-tight">
        Speedy fingers!
      </h2>
      <p className="mb-8 text-lg text-gray-600 leading-relaxed flex items-center justify-center gap-1.5 flex-wrap">
        <span>You've swiped through all available profiles in your preferences. Maybe it's time to take a break and touch some grass!</span>
        <Leaf size={18} className="text-emerald-500 animate-bounce shrink-0" />
      </p>
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRewind}
          className="flex items-center space-x-2 rounded-full border border-yellow-200 bg-white hover:bg-yellow-50 px-6 py-3 font-semibold text-yellow-600 shadow-md"
        >
          <RotateCcw size={18} />
          <span>Undo Last Swipe</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg"
        >
          <RefreshCw size={18} />
          <span>Load Profiles</span>
        </motion.button>
      </div>
    </div>
  );
}

function LoadingUI() {
  return (
    <div className="relative h-[28rem] w-full max-w-sm flex items-center justify-center">
      <div className="card h-[27rem] w-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-xl flex flex-col justify-between">
        <div className="h-[70%] w-full rounded-2xl bg-gray-100 animate-pulse" />
        <div className="space-y-3 mt-4">
          <div className="h-6 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
