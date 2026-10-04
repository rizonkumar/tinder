import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";
import { ROUTES } from "../../constants/navigation";
import { IconButton } from "../../components/ui/IconButton";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Field";

const CONFETTI_COLORS = ["#c43d22", "#a67c1a", "#2f7d4a", "#ece8e3"];

function MatchPhoto({ src, alt, rotate, x }) {
  return (
    <motion.div
      initial={{ rotate: rotate * 2, x, opacity: 0 }}
      animate={{ rotate, x: 0, opacity: 1 }}
      transition={{ delay: 0.15, type: "spring", damping: 22, stiffness: 220 }}
      className="size-32 overflow-hidden rounded-xl border-4 border-surface bg-background-secondary shadow-modal sm:size-36"
    >
      <img src={src || "/avatar.png"} alt={alt} className="size-full object-cover" />
    </motion.div>
  );
}

export default function MatchCelebrationOverlay() {
  const socket = useAuthStore((state) => state.socket);
  const { sendMessage, setActiveChatUser } = useMessageStore();
  const [matchData, setMatchData] = useState(null);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return undefined;
    const handleMatch = (data) => {
      setMatchData(data);
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
    };
    socket.on("matchCelebration", handleMatch);
    return () => socket.off("matchCelebration", handleMatch);
  }, [socket]);

  const reset = () => {
    setMatchData(null);
    setText("");
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!text.trim() || !matchData) return;
    setActiveChatUser(matchData.matchedUser);
    await sendMessage(text.trim());
    const targetId = matchData.matchedUser._id;
    reset();
    navigate(`${ROUTES.chat}/${targetId}`);
  };

  return (
    <AnimatePresence>
      {matchData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay p-4"
          role="dialog"
          aria-modal="true"
          aria-label="It's a match"
        >
          <motion.div
            initial={{ scale: 0.96, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 24, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="relative w-full max-w-md rounded-xl border border-border bg-surface p-6 text-center text-foreground shadow-modal sm:p-8"
          >
            <IconButton label="Close" size="sm" onClick={reset} className="absolute right-3 top-3">
              <X />
            </IconButton>

            <p className="eyebrow">Mutual like</p>
            <h1 className="heading-32 mt-2">It’s a match</h1>
            <p className="copy-14 mt-2 text-foreground-secondary">
              You and <span className="font-medium text-foreground">{matchData.matchedUser.name}</span> liked each other.
            </p>

            <div className="my-8 flex items-center justify-center -space-x-6">
              <MatchPhoto src={matchData.currentUser.image} alt="You" rotate={-6} x={-30} />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35, type: "spring", damping: 14, stiffness: 260 }}
                className="z-10 flex size-12 items-center justify-center rounded-full border-4 border-surface bg-accent text-accent-foreground shadow-modal"
              >
                <Heart size={20} className="fill-current" aria-hidden="true" />
              </motion.span>
              <MatchPhoto src={matchData.matchedUser.image} alt={matchData.matchedUser.name} rotate={6} x={30} />
            </div>

            <form onSubmit={handleSend} className="space-y-3">
              <Input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={`Say hi to ${matchData.matchedUser.name}`}
                aria-label="First message"
                autoFocus
                trailing={
                  <IconButton label="Send" size="sm" type="submit" variant="primary" disabled={!text.trim()}>
                    <Send />
                  </IconButton>
                }
              />
              <Button variant="secondary" className="w-full" onClick={reset}>
                Keep swiping
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
