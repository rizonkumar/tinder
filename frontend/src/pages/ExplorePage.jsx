import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import Sidebar from "../components/Sidebar";
import CardSwiper from "../components/CardSwiper";
import { useMatchStore } from "../store/useMatchStore";
import {
  ArrowLeft,
  Sparkles,
  Compass,
  Gamepad2,
  Plane,
  Utensils,
  Code2,
  Music,
  Dumbbell,
  BookOpen,
  Palette,
} from "lucide-react";
import { motion } from "framer-motion";

const EXPLORE_CATEGORIES = [
  { id: "Gaming", name: "Gamers", icon: Gamepad2, gradient: "from-indigo-500 to-purple-600" },
  { id: "Travel", name: "Travelers", icon: Plane, gradient: "from-blue-500 to-cyan-500" },
  { id: "Food", name: "Foodies", icon: Utensils, gradient: "from-amber-500 to-orange-600" },
  { id: "Coding", name: "Coders", icon: Code2, gradient: "from-emerald-500 to-teal-600" },
  { id: "Music", name: "Music Lovers", icon: Music, gradient: "from-pink-500 to-rose-600" },
  { id: "Fitness", name: "Fitness", icon: Dumbbell, gradient: "from-red-500 to-pink-600" },
  { id: "Reading", name: "Readers", icon: BookOpen, gradient: "from-sky-500 to-blue-600" },
  { id: "Art", name: "Artists", icon: Palette, gradient: "from-violet-500 to-fuchsia-600" },
];

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
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 lg:flex-row">
      <Sidebar />
      <div className="flex flex-grow flex-col overflow-hidden">
        <Header />

        <main className="relative flex flex-grow flex-col items-center justify-center p-4">
          {selectedCategory ? (
            <div className="flex flex-col items-center w-full max-w-sm">
              <button
                onClick={handleBack}
                className="self-start mb-4 flex items-center space-x-2 rounded-full border border-pink-100 bg-white/60 px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm backdrop-blur-sm transition-transform hover:scale-105"
              >
                <ArrowLeft size={16} />
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
            <div className="flex w-full max-w-2xl flex-col items-center text-center px-4 py-6">
              <div className="mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-3.5 text-white shadow-lg shadow-pink-200">
                <Compass size={32} className="animate-spin-slow" />
              </div>
              <h1 className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                Vibe Explore Hub
              </h1>
              <p className="mt-2 text-base text-gray-600 max-w-md">
                Find connections who match your exact interests and hobbies. Choose a vibe and start swiping!
              </p>

              <div className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
                {EXPLORE_CATEGORIES.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelect(cat.id)}
                      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${cat.gradient} p-6 text-left text-white shadow-md hover:shadow-xl transition-all h-32 flex flex-col justify-between`}
                    >
                      <div className="absolute -right-4 -bottom-4 opacity-15">
                        <Sparkles size={80} className="fill-current" />
                      </div>
                      <Icon size={28} className="stroke-[2.5]" />
                      <div>
                        <span className="text-lg font-bold tracking-wide block">
                          {cat.name}
                        </span>
                        <span className="mt-1 text-[10px] uppercase font-semibold opacity-80 tracking-wider block">
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
