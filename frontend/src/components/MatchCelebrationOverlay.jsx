import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";
import confetti from "canvas-confetti";

export default function MatchCelebrationOverlay() {
  const socket = useAuthStore((state) => state.socket);
  const { sendMessage, setActiveChatUser } = useMessageStore();
  const [matchData, setMatchData] = useState(null);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleMatch = (data) => {
      setMatchData(data);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f43f5e", "#ec4899", "#d946ef", "#eab308"],
      });
    };

    socket.on("matchCelebration", handleMatch);
    return () => {
      socket.off("matchCelebration", handleMatch);
    };
  }, [socket]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !matchData) return;

    setActiveChatUser(matchData.matchedUser);
    await sendMessage(text.trim());

    const targetId = matchData.matchedUser._id;
    setMatchData(null);
    setText("");
    navigate(`/chat/${targetId}`);
  };

  const handleClose = () => {
    setMatchData(null);
    setText("");
  };

  return (
    <AnimatePresence>
      {matchData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-lg select-none"
        >
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X size={30} />
          </button>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  y: "100vh",
                  x: `${Math.random() * 100}vw`,
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
                animate={{
                  y: "-10vh",
                  x: `calc(${Math.random() * 100}vw + ${Math.random() * 100 - 50}px)`,
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute text-pink-500/30"
              >
                <Heart size={40} className="fill-current" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.7, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative flex w-full max-w-lg flex-col items-center text-center text-white px-4"
          >
            <div className="absolute top-[-55px] animate-pulse">
              <Sparkles
                size={84}
                className="text-yellow-400 opacity-70 fill-current"
              />
            </div>

            <h1 className="bg-gradient-to-r from-red-400 via-pink-500 to-purple-400 bg-clip-text text-6xl font-extrabold tracking-wider text-transparent drop-shadow-xl font-serif">
              It's a Match!
            </h1>
            <p className="mt-4 text-xl font-light tracking-wide text-gray-300">
              You and{" "}
              <span className="font-semibold text-pink-400">
                {matchData.matchedUser.name}
              </span>{" "}
              liked each other!
            </p>

            <div className="my-12 flex items-center justify-center -space-x-8">
              <motion.div
                initial={{ rotate: -15, x: -40, opacity: 0 }}
                animate={{ rotate: -8, x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="h-36 w-36 overflow-hidden rounded-3xl border-4 border-white shadow-2xl"
              >
                <img
                  src={matchData.currentUser.image || "/avatar.png"}
                  alt="Your avatar"
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.4, 1] }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg border-4 border-white"
              >
                <Heart size={28} className="fill-current animate-bounce" />
              </motion.div>

              <motion.div
                initial={{ rotate: 15, x: 40, opacity: 0 }}
                animate={{ rotate: 8, x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="h-36 w-36 overflow-hidden rounded-3xl border-4 border-white shadow-2xl"
              >
                <img
                  src={matchData.matchedUser.image || "/avatar.png"}
                  alt={matchData.matchedUser.name}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>

            <form
              onSubmit={handleSend}
              className="w-full max-w-md space-y-4 px-4 pointer-events-auto"
            >
              <div className="flex items-center space-x-3 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 backdrop-blur-md focus-within:border-pink-500 focus-within:bg-white/15">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Say something nice to ${matchData.matchedUser.name}...`}
                  className="flex-grow bg-transparent text-sm text-white placeholder-gray-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="text-pink-400 hover:text-pink-300 disabled:opacity-50 disabled:hover:text-pink-400"
                >
                  <Send size={18} />
                </button>
              </div>

              <div className="flex flex-col space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full rounded-full border border-gray-500 py-3.5 font-bold text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Keep Swiping
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
