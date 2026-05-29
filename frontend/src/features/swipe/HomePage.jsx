import { useEffect } from "react";
import { Header } from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useMatchStore } from "../../store/useMatchStore";
import CardSwiper from "./CardSwiper";

export default function HomePage() {
  const {
    isLoadingUserProfiles,
    getUserProfiles,
    userProfiles,
    swipeLeft,
    swipeRight,
    swipeSuperLike,
    rewind,
  } = useMatchStore();

  useEffect(() => {
    getUserProfiles();
  }, [getUserProfiles]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 font-sans">
      <Sidebar />
      <div className="flex flex-grow flex-col h-full overflow-hidden">
        <Header />
        <main className="relative flex-grow h-[calc(100vh-72px)] overflow-hidden flex items-center justify-center p-4 bg-slate-50/50 dark:bg-zinc-950/20">
          <CardSwiper
            userProfiles={userProfiles}
            isLoadingUserProfiles={isLoadingUserProfiles}
            onRefresh={getUserProfiles}
            onSwipeLeft={swipeLeft}
            onSwipeRight={swipeRight}
            onSwipeSuperLike={swipeSuperLike}
            onRewind={rewind}
          />
        </main>
      </div>
    </div>
  );
}
