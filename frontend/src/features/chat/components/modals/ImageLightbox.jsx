import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IconButton } from "../../../../components/ui/IconButton";

export default function ImageLightbox({ imageUrl, onClose }) {
  useEffect(() => {
    if (!imageUrl) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imageUrl, onClose]);

  return (
    <AnimatePresence>
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[90] flex flex-col bg-black/90"
        >
          <div className="flex shrink-0 items-center justify-end gap-2 p-3" onClick={(event) => event.stopPropagation()}>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-white/10 px-3 text-sm font-medium text-white transition-colors hover:bg-white/20 focus-ring"
            >
              <ExternalLink size={15} aria-hidden="true" />
              Open original
            </a>
            <IconButton label="Close" variant="overlay" onClick={onClose} className="bg-white/10 hover:bg-white/20">
              <X />
            </IconButton>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center p-4 pt-0">
            <motion.img
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              src={imageUrl}
              alt="Shared photo"
              onClick={(event) => event.stopPropagation()}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
