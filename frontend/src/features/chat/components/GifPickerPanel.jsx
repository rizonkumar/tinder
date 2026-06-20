import { motion } from "framer-motion";
import LoadingState from "../../../components/common/LoadingState";

export default function GifPickerPanel({
  gifQuery,
  onGifQueryChange,
  gifs,
  isLoadingGifs,
  onSelectGif,
  onClose,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-20 left-4 right-4 z-50 rounded-md bg-background border border-border shadow-popover p-4 flex flex-col h-[280px]"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-foreground-secondary font-outfit uppercase tracking-wider">
          Search GIPHY GIFs
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-foreground-muted hover:text-foreground focus:outline-none"
        >
          Close
        </button>
      </div>

      <input
        type="text"
        value={gifQuery}
        onChange={(e) => onGifQueryChange(e.target.value)}
        placeholder="Type keyword e.g. wink, wave, cat..."
        className="w-full text-xs rounded-md border border-border bg-background-secondary px-3.5 py-2 outline-none mb-3 focus-ring text-foreground"
      />

      <div className="flex-grow overflow-y-auto grid grid-cols-3 gap-2 pr-0.5 scrollbar-none">
        {isLoadingGifs ? (
          <div className="col-span-3 flex items-center justify-center h-full">
            <LoadingState message="" type="inline" />
          </div>
        ) : gifs.length === 0 ? (
          <div className="col-span-3 text-center text-xs text-foreground-muted italic py-8">
            No GIFs found.
          </div>
        ) : (
          gifs.map((g) => (
            <div
              key={g.id}
              onClick={() => onSelectGif(g)}
              className="aspect-square rounded-md overflow-hidden cursor-pointer border border-border hover:border-border-strong hover:scale-[1.02] active:scale-[0.98] transition-all bg-background-secondary shrink-0"
            >
              <img
                src={g.url}
                alt={g.title}
                className="h-full w-full object-cover select-none"
                loading="lazy"
              />
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
