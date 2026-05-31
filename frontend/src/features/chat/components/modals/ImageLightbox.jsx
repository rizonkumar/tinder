import { X, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageLightbox({ imageUrl, onClose }) {
  return (
    <AnimatePresence>
      {imageUrl && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-pink-500 transition-colors p-2 bg-zinc-900/50 hover:bg-zinc-800/50 rounded-full select-none focus:outline-none"
            title="Close Lightbox"
          >
            <X size={20} />
          </motion.button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="max-w-[90vw] max-h-[80vh] flex flex-col items-center select-none"
          >
            <img
              src={imageUrl}
              alt="Shared media lightbox"
              className="max-w-full max-h-[72vh] rounded-2xl object-contain shadow-2xl border border-zinc-800"
            />
            <div className="flex items-center space-x-3 mt-4 shrink-0">
              <a
                href={imageUrl}
                download="shared_image.png"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-md transition-all font-outfit"
              >
                <Paperclip size={13} />
                <span>Open in Full Resolution</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
