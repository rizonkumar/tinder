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
      colors: ["#171717", "#28a948", "#006bff"],
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
              className="absolute inset-0 z-0 origin-bottom scale-95 transform overflow-hidden rounded-lg border border-border bg-background shadow-card pointer-events-none opacity-80 transition-all duration-300"
            >
              <img
                src={nextProfile.image || "/avatar.png"}
                alt={nextProfile.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-black/40" />
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
              className={`absolute inset-0 z-10 cursor-grab active:cursor-grabbing overflow-hidden rounded-lg bg-background shadow-card transition-transform duration-75 border-4 ${
                activeProfile.isSuperLikedByTarget
                  ? "border-blue-700"
                  : "border-border"
              }`}
            >
              {!isExpanded && (
                <>
                  <motion.div
                    style={{ opacity: likeOpacity }}
                    className="absolute left-6 top-8 z-30 -rotate-12 rounded-md border-4 border-green-700 bg-background px-4 py-1.5 text-2xl font-black tracking-widest text-green-700 font-outfit"
                  >
                    LIKE
                  </motion.div>
                  <motion.div
                    style={{ opacity: nopeOpacity }}
                    className="absolute right-6 top-8 z-30 rotate-12 rounded-md border-4 border-red-800 bg-background px-4 py-1.5 text-2xl font-black tracking-widest text-red-800 font-outfit"
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

              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-black/40 pointer-events-none" />

              {activeProfile.isSuperLikedByTarget && (
                <div className="absolute top-6 left-6 z-20 flex items-center space-x-1.5 rounded-full bg-blue-700 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-card">
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
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-all pointer-events-auto"
                    aria-label="View full details"
                  >
                    <Info size={18} className="stroke-[2.5]" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-white line-clamp-2 leading-relaxed font-medium">
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
                    className="absolute inset-x-0 bottom-0 z-40 h-[68%] rounded-t-lg bg-background p-5 border-t border-border shadow-modal flex flex-col justify-between text-foreground"
                  >
                    <div className="flex items-start justify-between select-none shrink-0 pb-1.5">
                      <div>
                        <h3 className="text-2xl font-black text-foreground font-outfit">
                          {activeProfile.name},{" "}
                          <span className="font-semibold">
                            {activeProfile.age}
                          </span>
                        </h3>
                        <p className="text-xs text-accent font-bold capitalize mt-0.5">
                          {activeProfile.gender} • interested in{" "}
                          {activeProfile.genderPreference}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(false);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-active hover:bg-surface-hover text-foreground-secondary transition-colors"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>

                    {/* Scrolling strictly bound internally with hidden bar */}
                    <div className="flex-grow overflow-y-auto my-3 space-y-4 pr-1 text-left select-none scrollbar-none">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
                          About Me
                        </h4>
                        <p className="mt-1.5 text-sm text-foreground-secondary leading-relaxed font-medium">
                          {activeProfile.bio || "No bio available."}
                        </p>
                      </div>

                      <CompatibilityRadar profile={activeProfile} />

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground-muted mb-2.5">
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
                                      ? "bg-green-100 border-green-200 text-green-700 shadow-card"
                                      : "bg-background-secondary border-border text-foreground-secondary"
                                  }`}
                                >
                                  {interest} {isShared && "✨"}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-foreground-muted italic font-medium">
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
          className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background text-red-800 shadow-card hover:bg-surface-hover focus-ring transition-colors"
          aria-label="Swipe Left (Dislike)"
        >
          <X size={26} className="stroke-[3]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRewindBtn}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-card hover:bg-surface-hover focus-ring transition-colors"
          aria-label="Rewind last swipe"
        >
          <RotateCcw size={20} className="stroke-[2.5]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleBtnSwipe("super")}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-blue-700 shadow-card hover:bg-surface-hover focus-ring transition-colors"
          aria-label="Super Like"
        >
          <Star size={20} className="fill-current stroke-[2.5]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleBtnSwipe("right")}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background text-green-700 shadow-card hover:bg-surface-hover focus-ring transition-colors"
          aria-label="Swipe Right (Like)"
        >
          <Heart size={26} className="fill-current stroke-[2]" />
        </motion.button>
      </div>
    </div>
  );
}
