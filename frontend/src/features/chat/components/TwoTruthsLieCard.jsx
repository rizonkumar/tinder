import { Gamepad2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function TwoTruthsLieCard({
  message,
  isSentByMe,
  isHighlighted,
  activeChatUserName,
  onRespond,
}) {
  const info = message.gameInfo || {};
  const statements = info.statements || [];
  const status = info.status || "pending";
  const guessIndex = info.guessIndex;
  const lieIndex = info.lieIndex;

  const isPending = status === "pending";
  const isCorrect = status === "correct";
  const isIncorrect = status === "incorrect";

  const handleGuess = async (idx) => {
    if (!isPending || isSentByMe) return;
    
    if (idx === lieIndex) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#10b981", "#34d399", "#6ee7b7", "#ffffff"],
      });
    }
    
    await onRespond(message._id, idx);
  };

  const getBorderColor = () => {
    if (isCorrect) return "border-green-300 bg-green-100";
    if (isIncorrect) return "border-red-300 bg-red-100";
    return "border-border bg-gray-100";
  };

  return (
    <div
      id={`msg-${message._id}`}
      className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-4 transition-all duration-300 ${
        isHighlighted ? "scale-[1.02]" : ""
      }`}
    >
      <div
        className={`w-full max-w-[320px] rounded-[24px] p-5 shadow-card border relative overflow-hidden transition-all duration-200 ${getBorderColor()} ${
          isHighlighted ? "ring-2 ring-ring" : ""
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-[3px] ${
            isCorrect ? "bg-green-700" : isIncorrect ? "bg-red-800" : "bg-accent"
          }`}
        />

        <div className="flex items-center justify-between mb-4 mt-0.5 select-none font-outfit">
          <span className="text-[9px] font-black uppercase tracking-widest text-foreground-muted">
            Two Truths & A Lie
          </span>
          {isCorrect && (
            <span className="flex items-center space-x-1 rounded-full bg-green-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-green-700">
              <CheckCircle2 size={10} />
              <span>Solved</span>
            </span>
          )}
          {isIncorrect && (
            <span className="flex items-center space-x-1 rounded-full bg-red-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-800">
              <XCircle size={10} />
              <span>Failed</span>
            </span>
          )}
          {isPending && (
            <span className="flex items-center space-x-1 rounded-full bg-amber-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-700">
              <Clock size={10} />
              <span>Active</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
              isCorrect ? "bg-green-700" : isIncorrect ? "bg-red-800" : "bg-accent"
            } text-white`}
          >
            <Gamepad2 size={18} className="stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-xs font-black text-foreground font-outfit uppercase tracking-wide leading-none mb-1">
              {isSentByMe ? "Your Challenge" : `${activeChatUserName}'s Challenge`}
            </h4>
            <p className="text-[9px] text-foreground-muted font-bold font-outfit uppercase tracking-wider">
              {isPending ? "Find the statement that is a lie!" : "Game completed"}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {statements.map((statement, idx) => {
            let btnStyle = "border-border bg-background-secondary text-foreground-secondary hover:bg-surface-hover cursor-pointer";
            let badge = "";

            if (!isPending) {
              if (idx === lieIndex) {
                btnStyle = "border-green-300 bg-green-100 text-green-700 font-semibold cursor-default";
                badge = "The Lie 🚫";
              } else if (idx === guessIndex) {
                btnStyle = "border-red-300 bg-red-100 text-red-800 cursor-default";
                badge = isSentByMe ? `${activeChatUserName}'s Guess` : "Your Guess";
              } else {
                btnStyle = "border-border bg-background-secondary text-foreground-muted opacity-60 cursor-default";
              }
            } else {
              if (isSentByMe && idx === lieIndex) {
                btnStyle = "border-red-300 bg-red-100 text-red-800 cursor-default";
                badge = "The Lie 🚫";
              } else if (isSentByMe) {
                btnStyle = "border-border bg-background-secondary text-foreground-secondary cursor-default";
              }
            }

            return (
              <motion.button
                key={idx}
                disabled={isSentByMe || !isPending}
                whileHover={isSentByMe || !isPending ? {} : { scale: 1.01 }}
                whileTap={isSentByMe || !isPending ? {} : { scale: 0.99 }}
                onClick={() => handleGuess(idx)}
                className={`w-full text-left p-3 rounded-xl border text-[11px] font-sans leading-relaxed transition-all flex flex-col justify-between items-start outline-none ${btnStyle}`}
              >
                <span>{statement}</span>
                {badge && (
                  <span className={`text-[8px] font-black uppercase font-outfit tracking-widest mt-1.5 px-2 py-0.5 rounded-full ${
                    badge.includes("Lie")
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}>
                    {badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {isPending && isSentByMe && (
          <div className="flex items-center justify-center space-x-1.5 text-center text-[10px] text-foreground-muted bg-background-secondary rounded-xl py-2 font-outfit font-bold tracking-wide select-none">
            <Clock size={11} />
            <span>Awaiting {activeChatUserName}&apos;s guess</span>
          </div>
        )}

        <span className="block text-[8px] mt-2.5 text-right font-medium text-foreground-muted font-sans select-none">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
