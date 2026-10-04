import { motion } from "framer-motion";
import { Search, Star, X, ImageOff } from "lucide-react";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import { Input } from "../../../components/ui/Field";
import { IconButton } from "../../../components/ui/IconButton";
import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/ui/EmptyState";

const GIF_TABS = [
  { value: "trending", label: "GIFs" },
  { value: "favorites", label: "Favorites" },
];

function GifTile({ gif, onSelectGif, onToggleFavorite, favorited }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-md bg-background-secondary">
      <button type="button" onClick={() => onSelectGif(gif)} className="block size-full focus-ring" aria-label={`Send ${gif.title || "GIF"}`}>
        <img src={gif.url} alt="" loading="lazy" className="size-full object-cover" />
      </button>
      <IconButton
        label={favorited ? "Remove from favorites" : "Add to favorites"}
        variant="overlay"
        size="sm"
        onClick={() => onToggleFavorite(gif)}
        className="absolute right-1 top-1 size-7 rounded-full opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 data-[on=true]:opacity-100"
        data-on={favorited}
      >
        <Star className={favorited ? "fill-current" : undefined} />
      </IconButton>
    </div>
  );
}

export default function GifPickerPanel({
  gifQuery,
  onGifQueryChange,
  gifs,
  isLoadingGifs,
  gifTab,
  onSetGifTab,
  favorites,
  onToggleFavorite,
  isFavorite,
  onSelectGif,
  onClose,
}) {
  const isFavoritesTab = gifTab === "favorites";
  const items = isFavoritesTab ? favorites : gifs;

  const renderGrid = () => {
    if (!isFavoritesTab && isLoadingGifs) {
      return Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="aspect-square" />);
    }
    if (items.length === 0) {
      return (
        <div className="col-span-full">
          <EmptyState
            compact
            icon={isFavoritesTab ? Star : ImageOff}
            title={isFavoritesTab ? "No favorites yet" : "No GIFs found"}
            description={isFavoritesTab ? "Star a GIF to keep it here." : "Try a different word."}
          />
        </div>
      );
    }
    return items.map((gif) => (
      <GifTile key={gif.id} gif={gif} onSelectGif={onSelectGif} onToggleFavorite={onToggleFavorite} favorited={isFavorite(gif.id)} />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.15 }}
      role="dialog"
      aria-label="GIF picker"
      className="absolute inset-x-3 bottom-full z-40 mb-2 flex h-[22rem] flex-col rounded-xl border border-border bg-surface shadow-popover sm:left-4 sm:right-auto sm:w-[26rem]"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border p-2.5">
        <SegmentedControl size="sm" label="GIF source" className="w-auto" options={GIF_TABS} value={gifTab} onChange={onSetGifTab} />
        <IconButton label="Close GIF picker" size="sm" onClick={onClose}>
          <X />
        </IconButton>
      </div>
      {!isFavoritesTab && (
        <div className="px-2.5 pt-2.5">
          <Input
            icon={Search}
            type="search"
            value={gifQuery}
            onChange={(event) => onGifQueryChange(event.target.value)}
            placeholder="Search GIPHY"
            aria-label="Search GIFs"
            className="h-9"
            autoFocus
          />
        </div>
      )}
      <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-3 gap-1.5 overflow-y-auto p-2.5 sm:grid-cols-4">{renderGrid()}</div>
      <p className="border-t border-border px-3 py-1.5 text-right text-[11px] text-foreground-muted">Powered by GIPHY</p>
    </motion.div>
  );
}
