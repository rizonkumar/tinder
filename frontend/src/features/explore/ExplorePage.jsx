import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import CardSwiper from "../swipe/CardSwiper";
import { useMatchStore } from "../../store/useMatchStore";
import { ArrowLeft, Compass, Sparkles } from "lucide-react";
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

  // Helper to map old gradients to clean SaaS flat pastel icon-rings
  const getCatColorClasses = (gradient) => {
    if (gradient.includes("purple") || gradient.includes("indigo")) {
      return { icon: "text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20" };
    }
    if (gradient.includes("orange") || gradient.includes("amber") || gradient.includes("yellow")) {
      return { icon: "text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20" };
    }
    if (gradient.includes("green") || gradient.includes("emerald") || gradient.includes("teal")) {
      return { icon: "text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20" };
    }
    return { icon: "text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/20" };
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 font-sans">
      <Sidebar />
      <div className="flex flex-grow flex-col h-full overflow-hidden">
        <Header />

        <main className="relative flex-grow h-[calc(100vh-72px)] overflow-hidden flex items-center justify-center p-4 bg-slate-50/50 dark:bg-zinc-950/20">
          {selectedCategory ? (
            <div className="flex flex-col items-center w-full max-w-sm h-full justify-center">
              <button
                onClick={handleBack}
                className="self-start mb-4 flex items-center space-x-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-bold text-slate-655 dark:text-slate-300 shadow-sm transition-all hover:scale-105 active:scale-95 focus:outline-none"
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
            <div className="flex w-full max-w-2xl flex-col items-center text-center px-4 py-6 justify-center h-full">
              <div className="mb-4 rounded-full bg-pink-50 dark:bg-pink-950/20 p-3.5 text-pink-500 shadow-inner">
                <Compass size={32} className="animate-spin-slow" />
              </div>
              <h1 className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-3xl font-black tracking-tight text-transparent font-outfit uppercase">
                Vibe Explore Hub
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md font-medium leading-relaxed">
                Find connections who match your exact interests and hobbies. Choose a vibe and start swiping!
              </p>

              <div className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4 select-none">
                {EXPLORE_CATEGORIES.map((cat, idx) => {
                  const Icon = Icons[cat.iconName] || Icons.Compass;
                  const colors = getCatColorClasses(cat.gradient);
                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelect(cat.id)}
                      className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 p-5 text-left text-slate-800 dark:text-slate-100 shadow-sm hover:shadow-md hover:border-pink-500/20 dark:hover:border-pink-500/20 transition-all h-32 flex flex-col justify-between focus:outline-none"
                    >
                      <div className={`p-2 rounded-xl w-fit ${colors.icon}`}>
                        <Icon size={20} className="stroke-[2.5]" />
                      </div>
                      <div>
                        <span className="text-base font-black tracking-wide block font-outfit uppercase">
                          {cat.name}
                        </span>
                        <span className="mt-0.5 text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block">
                          Tap to Enter
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
