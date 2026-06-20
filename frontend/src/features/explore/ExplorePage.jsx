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
    <AppLayout variant="center">
      {selectedCategory ? (
        <div className="flex flex-col items-center w-full max-w-sm">
          <button
            onClick={handleBack}
            className="self-start mb-4 flex items-center space-x-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-bold text-foreground-secondary shadow-card transition-all hover:scale-105 active:scale-95 focus-ring"
          >
            <ArrowLeft size={14} className="stroke-[2.5]" />
            <span>Vibes Hub</span>
          </button>

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
      ) : (
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-background-secondary p-3.5 text-accent shadow-card">
            <Compass size={32} className="animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground font-outfit uppercase">
            Vibe Explore Hub
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-foreground-secondary max-w-md font-medium leading-relaxed">
            Find connections who match your exact interests and hobbies. Choose a vibe and start swiping!
          </p>

          <div className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4 select-none">
            {EXPLORE_CATEGORIES.map((cat, idx) => {
              const Icon = Icons[cat.iconName] || Icons.Compass;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(cat.id)}
                  className="relative overflow-hidden rounded-3xl bg-background border border-border p-5 text-left text-foreground shadow-card hover:bg-surface-hover hover:border-border-strong transition-all h-32 flex flex-col justify-between focus-ring"
                >
                  <div className={`p-2 rounded-xl w-fit ${cat.surface}`}>
                    <Icon size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-base font-black tracking-wide block font-outfit uppercase">
                      {cat.name}
                    </span>
                    <span className="mt-0.5 text-[9px] uppercase font-bold text-foreground-muted tracking-wider block">
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
