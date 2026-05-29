import { useEffect } from "react";
import { Header } from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";
import CardSwiper from "../components/CardSwiper";

const HomePage = () => {
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
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 lg:flex-row">
      <Sidebar />
      <div className="flex flex-grow flex-col overflow-hidden">
        <Header />
        <main className="relative flex flex-grow flex-col items-center justify-center p-4">
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
};

export default HomePage;
