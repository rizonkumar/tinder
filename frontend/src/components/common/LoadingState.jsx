import { motion } from "framer-motion";
import { Loader } from "lucide-react";

export default function LoadingState({ message = "Loading...", type = "inline" }) {
  if (type === "screen") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background select-none">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="h-10 w-10 rounded-full border-2 border-accent border-t-transparent"
          />
          <p className="text-xs font-semibold tracking-wider text-foreground-muted font-outfit uppercase">
            Loading Swipe
          </p>
        </div>
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="relative h-[28rem] w-full max-w-sm flex items-center justify-center select-none">
        <div className="card h-[27rem] w-full overflow-hidden rounded-lg border border-border bg-background p-4 shadow-card flex flex-col justify-between">
          <div className="h-[70%] w-full rounded-md bg-background-secondary animate-pulse" />
          <div className="space-y-3 mt-4">
            <div className="h-6 w-3/4 rounded bg-background-secondary animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-background-secondary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-4 py-16 select-none transition-colors duration-300">
      <Loader className="mb-4 animate-spin text-accent" size={type === "large" ? 50 : 32} />
      {message && (
        <>
          <h3 className="mb-2 text-lg font-bold text-foreground select-none font-outfit">
            {message}
          </h3>
          <p className="max-w-xs text-xs text-foreground-muted select-none font-medium">Please hold on a moment...</p>
        </>
      )}
    </div>
  );
}
