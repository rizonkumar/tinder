import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, Heart, RotateCcw, Info, ChevronDown, RefreshCw, Star, Inbox } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuthStore } from "../../store/useAuthStore";
import CompatibilityRadar from "../explore/CompatibilityRadar";
import LoadingState from "../../components/common/LoadingState";
import { EmptyState } from "../../components/ui/EmptyState";
import { IconButton } from "../../components/ui/IconButton";
import { Badge } from "../../components/ui/Badge";
import { cn } from "../../utils/cn";

const SWIPE_THRESHOLD = 130;
const CONFETTI_COLORS = ["#c43d22", "#a67c1a", "#2f7d4a", "#1c1917"];

function SwipeStamp({ label, tone, style, className }) {
  return (
    <motion.div
      style={style}
      className={cn(
        "pointer-events-none absolute top-6 z-30 rounded-md border-[3px] bg-surface/90 px-3 py-1 text-lg font-bold uppercase tracking-[0.12em]",
        tone === "like" ? "left-5 -rotate-12 border-success text-success" : "right-5 rotate-12 border-danger text-danger",
        className
      )}
    >
      {label}
    </motion.div>
  );
}

function ProfileCaption({ profile, onExpand }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-surface px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="heading-20 truncate text-foreground">
            {profile.name}
            <span className="ml-1.5 font-normal text-foreground-secondary">{profile.age}</span>
          </p>
          <p className="copy-13 mt-0.5 line-clamp-2 text-foreground-secondary">{profile.bio || "No bio yet."}</p>
        </div>
        <IconButton label="View full profile" variant="outline" size="sm" onClick={onExpand} className="pointer-events-auto mt-0.5">
          <Info />
        </IconButton>
      </div>
    </div>
  );
}

function ProfileDetails({ profile, sharedInterests, onClose }) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 300 }}
      className="absolute inset-x-0 bottom-0 z-40 flex h-[72%] flex-col rounded-t-xl border-t border-border bg-surface text-foreground shadow-modal"
    >
      <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4">
        <div>
          <p className="heading-20">
            {profile.name}
            <span className="ml-1.5 font-normal text-foreground-secondary">{profile.age}</span>
          </p>
          <p className="copy-13 mt-0.5 capitalize text-foreground-secondary">
            {profile.gender} · interested in {profile.genderPreference}
          </p>
        </div>
        <IconButton label="Collapse details" size="sm" onClick={onClose}>
          <ChevronDown />
        </IconButton>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-5 scrollbar-none">
        <section>
          <p className="eyebrow">About</p>
          <p className="copy-14 mt-1.5 text-foreground-secondary">{profile.bio || "No bio yet."}</p>
        </section>
        <CompatibilityRadar profile={profile} />
        <section>
          <p className="eyebrow">Interests</p>
          {profile.interests?.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.interests.map((interest) => (
                <Badge key={interest} tone={sharedInterests.includes(interest) ? "success" : "neutral"}>
                  {interest}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="copy-13 mt-1.5 text-foreground-muted">No interests listed yet.</p>
          )}
        </section>
      </div>
    </motion.div>
  );
}

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
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-110, -20], [1, 0]);

  const celebrate = (scalar) => {
    confetti({ particleCount: 90, spread: 65, origin: { y: 0.75 }, colors: CONFETTI_COLORS, scalar });
  };

  const handleSwipe = async (direction, user) => {
    setIsExpanded(false);
    if (direction === "right") {
      const data = await onSwipeRight(user);
      if (data?.isMatch) celebrate(1);
    } else if (direction === "left") {
      await onSwipeLeft(user);
    } else if (direction === "super") {
      const data = await onSwipeSuperLike(user);
      celebrate(0.8);
      if (data?.isMatch) celebrate(1);
    }
    x.set(0);
  };

  const handleButtonSwipe = (direction) => {
    if (userProfiles.length === 0) return;
    handleSwipe(direction, userProfiles[0]);
  };

  const handleRewind = async () => {
    setIsExpanded(false);
    await onRewind();
  };

  if (isLoadingUserProfiles) {
    return <LoadingState type="card" />;
  }

  if (userProfiles.length === 0) {
    return (
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface">
        <EmptyState
          icon={Inbox}
          title="You’re all caught up"
          description="You have seen everyone who matches your preferences right now. Check back later or widen your preferences."
          actions={[
            { label: "Undo last swipe", onClick: handleRewind, variant: "secondary", icon: RotateCcw },
            { label: "Refresh", onClick: onRefresh, variant: "primary", icon: RefreshCw },
          ]}
        />
      </div>
    );
  }

  const activeProfile = userProfiles[0];
  const nextProfile = userProfiles[1];
  const sharedInterests = authUser?.interests || [];

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5 select-none">
      <div className="relative aspect-[4/5] w-full max-h-[calc(100dvh-13rem)]">
        {nextProfile && (
          <div
            key={nextProfile._id}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 origin-bottom scale-[0.96] translate-y-2 overflow-hidden rounded-xl border border-border bg-surface opacity-70"
          >
            <img src={nextProfile.image || "/avatar.png"} alt="" className="size-full object-cover" />
          </div>
        )}

        <AnimatePresence>
          {activeProfile && (
            <motion.div
              key={activeProfile._id}
              drag={isExpanded ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              style={{ x, rotate }}
              onDragEnd={async (event, info) => {
                if (isExpanded) return;
                if (info.offset.x > SWIPE_THRESHOLD) await handleSwipe("right", activeProfile);
                else if (info.offset.x < -SWIPE_THRESHOLD) await handleSwipe("left", activeProfile);
              }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute inset-0 z-10 cursor-grab overflow-hidden rounded-xl border bg-surface shadow-modal active:cursor-grabbing",
                activeProfile.isSuperLikedByTarget ? "border-blue-600" : "border-border"
              )}
            >
              {!isExpanded && (
                <>
                  <SwipeStamp label="Like" tone="like" style={{ opacity: likeOpacity }} />
                  <SwipeStamp label="Nope" tone="nope" style={{ opacity: nopeOpacity }} />
                </>
              )}

              <img
                src={activeProfile.image || "/avatar.png"}
                alt={activeProfile.name}
                className="pointer-events-none size-full object-cover"
                draggable={false}
              />

              {activeProfile.isSuperLikedByTarget && (
                <div className="absolute left-4 top-4 z-20">
                  <Badge tone="accent" icon={Star} className="bg-surface text-blue-700">
                    Super liked you
                  </Badge>
                </div>
              )}

              <ProfileCaption profile={activeProfile} onExpand={() => setIsExpanded(true)} />

              <AnimatePresence>
                {isExpanded && (
                  <ProfileDetails
                    profile={activeProfile}
                    sharedInterests={sharedInterests}
                    onClose={() => setIsExpanded(false)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-3">
        <IconButton label="Pass" variant="outline" size="xl" className="rounded-full text-danger hover:bg-danger-surface" onClick={() => handleButtonSwipe("left")}>
          <X strokeWidth={2.5} />
        </IconButton>
        <IconButton label="Undo last swipe" variant="outline" size="lg" className="rounded-full" onClick={handleRewind}>
          <RotateCcw />
        </IconButton>
        <IconButton label="Super like" variant="outline" size="lg" className="rounded-full text-blue-700 hover:bg-blue-100" onClick={() => handleButtonSwipe("super")}>
          <Star className="fill-current" />
        </IconButton>
        <IconButton label="Like" variant="outline" size="xl" className="rounded-full text-success hover:bg-success-surface" onClick={() => handleButtonSwipe("right")}>
          <Heart className="fill-current" strokeWidth={2} />
        </IconButton>
      </div>
    </div>
  );
}
