import { useState, useEffect } from "react";
import AppLayout from "../../components/AppLayout";
import CardSwiper from "../swipe/CardSwiper";
import { useMatchStore } from "../../store/useMatchStore";
import { ArrowLeft, Compass } from "lucide-react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { EXPLORE_CATEGORIES } from "../../constants";

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const {
    isLoadingUserProfiles,
    getExploreProfiles,
    userProfiles,
    swipeLeft,
    swipeRight,
    swipeSuperLike,
    rewind,
  } = useMatchStore();

  useEffect(() => {
    if (selectedCategory) {
      getExploreProfiles(selectedCategory);
    }
  }, [selectedCategory, getExploreProfiles]);

  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <AppLayout variant="scroll">
      {selectedCategory ? (
        <div className="space-y-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-xs font-bold text-foreground-secondary shadow-card transition-colors hover:bg-surface-hover focus-ring"
          >
            <ArrowLeft size={14} className="stroke-[2.5]" />
            <span>Vibes Hub</span>
          </button>

          <div className="mx-auto w-full max-w-sm">
            <CardSwiper
              userProfiles={userProfiles}
              isLoadingUserProfiles={isLoadingUserProfiles}
              onRefresh={() => getExploreProfiles(selectedCategory)}
              onSwipeLeft={swipeLeft}
              onSwipeRight={swipeRight}
              onSwipeSuperLike={swipeSuperLike}
              onRewind={rewind}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center gap-3.5">
            <div className="rounded-lg border border-border bg-background-secondary p-3 text-accent">
              <Compass size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-foreground font-outfit">
                Vibe Explore Hub
              </h1>
              <p className="mt-0.5 text-sm font-medium text-foreground-secondary">
                Find connections who match your exact interests and hobbies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 select-none">
            {EXPLORE_CATEGORIES.map((cat, idx) => {
              const Icon = Icons[cat.iconName] || Icons.Compass;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(cat.id)}
                  className="flex h-32 flex-col justify-between overflow-hidden rounded-lg border border-border bg-background p-5 text-left text-foreground shadow-card transition-colors hover:border-border-strong hover:bg-surface-hover focus-ring"
                >
                  <div className={`w-fit rounded-md p-2 ${cat.surface}`}>
                    <Icon size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="block text-base font-bold uppercase tracking-wide font-outfit">
                      {cat.name}
                    </span>
                    <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-wider text-foreground-muted">
                      Tap to Enter
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
