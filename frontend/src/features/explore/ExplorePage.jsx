import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import AppLayout from "../../components/AppLayout";
import CardSwiper from "../swipe/CardSwiper";
import { useMatchStore } from "../../store/useMatchStore";
import { EXPLORE_CATEGORIES } from "../../constants";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";

function CategoryTile({ category, onSelect }) {
  const Icon = Icons[category.iconName] || Icons.Compass;
  return (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-4 text-left shadow-card transition-colors hover:border-border-strong hover:bg-surface-raised focus-ring sm:flex-col sm:items-start sm:gap-5 sm:p-5"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-background-secondary text-foreground">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-between gap-2 sm:w-full">
        <span className="min-w-0">
          <span className="heading-16 block truncate text-foreground">{category.name}</span>
          <span className="copy-13 block text-foreground-secondary">Into {category.id.toLowerCase()}</span>
        </span>
        <ChevronRight size={16} className="shrink-0 text-foreground-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </button>
  );
}

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
    if (selectedCategory) getExploreProfiles(selectedCategory);
  }, [selectedCategory, getExploreProfiles]);

  const category = EXPLORE_CATEGORIES.find((item) => item.id === selectedCategory);

  if (category) {
    return (
      <AppLayout variant="scroll">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="-ml-2">
              <ArrowLeft aria-hidden="true" />
              All vibes
            </Button>
          </div>
          <PageHeader title={category.name} description={`People who are into ${category.id.toLowerCase()}, in your preferences.`} />
          <div className="flex justify-center pt-2">
            <CardSwiper
              userProfiles={userProfiles}
              isLoadingUserProfiles={isLoadingUserProfiles}
              onRefresh={() => getExploreProfiles(category.id)}
              onSwipeLeft={swipeLeft}
              onSwipeRight={swipeRight}
              onSwipeSuperLike={swipeSuperLike}
              onRewind={rewind}
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout variant="scroll">
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Explore"
          description="Pick a vibe and swipe only within people who share it."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EXPLORE_CATEGORIES.map((item) => (
            <CategoryTile key={item.id} category={item} onSelect={setSelectedCategory} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
