import { motion } from "framer-motion";
import { Star } from "lucide-react";
import LoadingState from "../../../components/common/LoadingState";

function GifTile({ gif, onSelectGif, onToggleFavorite, favorited }) {
  return (
    <div className="relative aspect-square rounded-md overflow-hidden border border-border hover:border-border-strong transition-all bg-background-secondary shrink-0 group">
      <button
        type="button"
        onClick={() => onSelectGif(gif)}
        className="block h-full w-full"
      >
        <img
          src={gif.url}
          alt={gif.title}
          className="h-full w-full object-cover select-none group-hover:scale-[1.03] transition-transform"
          loading="lazy"
        />
      </button>
      <button
        type="button"
        onClick={() => onToggleFavorite(gif)}
        className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 backdrop-blur text-foreground-muted hover:text-amber-600 transition-colors focus:outline-none"
        aria-label={favorited ? "Remove favorite" : "Add favorite"}
      >
        <Star
          size={13}
          className={favorited ? "fill-amber-500 text-amber-500" : ""}
        />
      </button>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-outfit transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-20 left-4 right-4 z-50 rounded-md bg-background border border-border shadow-popover p-4 flex flex-col h-[300px]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <TabButton
            active={!isFavoritesTab}
            onClick={() => onSetGifTab("trending")}
          >
            GIPHY
          </TabButton>
          <TabButton
            active={isFavoritesTab}
            onClick={() => onSetGifTab("favorites")}
          >
            Favorites
          </TabButton>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-foreground-muted hover:text-foreground focus:outline-none"
        >
          Close
        </button>
      </div>

      {!isFavoritesTab && (
        <input
          type="text"
          value={gifQuery}
          onChange={(e) => onGifQueryChange(e.target.value)}
          placeholder="Type keyword e.g. wink, wave, cat..."
          className="w-full text-xs rounded-md border border-border bg-background-secondary px-3.5 py-2 outline-none mb-3 focus-ring text-foreground"
        />
      )}

      <div className="flex-grow overflow-y-auto grid grid-cols-3 gap-2 pr-0.5 scrollbar-none">
        {!isFavoritesTab && isLoadingGifs ? (
          <div className="col-span-3 flex items-center justify-center h-full">
            <LoadingState message="" type="inline" />
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-3 text-center text-xs text-foreground-muted italic py-8">
            {isFavoritesTab ? "No favorite GIFs yet." : "No GIFs found."}
          </div>
        ) : (
          items.map((gif) => (
            <GifTile
              key={gif.id}
              gif={gif}
              onSelectGif={onSelectGif}
              onToggleFavorite={onToggleFavorite}
              favorited={isFavorite(gif.id)}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}
