import { useEffect } from "react";
import AppLayout from "../../components/AppLayout";
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
    <AppLayout variant="fixed">
      <CardSwiper
        userProfiles={userProfiles}
        isLoadingUserProfiles={isLoadingUserProfiles}
        onRefresh={getUserProfiles}
        onSwipeLeft={swipeLeft}
        onSwipeRight={swipeRight}
        onSwipeSuperLike={swipeSuperLike}
        onRewind={rewind}
      />
    </AppLayout>
  );
}
