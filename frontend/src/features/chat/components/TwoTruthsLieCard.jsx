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
    if (isCorrect) return "border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/10 dark:bg-emerald-950/5";
    if (isIncorrect) return "border-rose-200 dark:border-rose-800/40 bg-rose-50/10 dark:bg-rose-955/5";
    return "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900";
  };

  return (
    <div
      id={`msg-${message._id}`}
      className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-4 transition-all duration-300 ${
        isHighlighted ? "scale-[1.02]" : ""
      }`}
    >
      <div
        className={`w-full max-w-[320px] rounded-[24px] p-5 shadow-sm border relative overflow-hidden transition-all duration-200 ${getBorderColor()} ${
          isHighlighted ? "ring-4 ring-pink-500/40 shadow-lg shadow-pink-500/30" : ""
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-[3px] ${
            isCorrect ? "bg-emerald-500" : isIncorrect ? "bg-rose-500" : "bg-pink-500"
          }`}
        />

        <div className="flex items-center justify-between mb-4 mt-0.5 select-none font-outfit">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
            Two Truths & A Lie
          </span>
          {isCorrect && (
            <span className="flex items-center space-x-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={10} />
              <span>Solved</span>
            </span>
          )}
          {isIncorrect && (
            <span className="flex items-center space-x-1 rounded-full bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              <XCircle size={10} />
              <span>Failed</span>
            </span>
          )}
          {isPending && (
            <span className="flex items-center space-x-1 rounded-full bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Clock size={10} />
              <span>Active</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
              isCorrect ? "bg-emerald-500" : isIncorrect ? "bg-rose-500" : "bg-pink-500"
            } text-white`}
          >
            <Gamepad2 size={18} className="stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-zinc-100 font-outfit uppercase tracking-wide leading-none mb-1">
              {isSentByMe ? "Your Challenge" : `${activeChatUserName}'s Challenge`}
            </h4>
            <p className="text-[9px] text-slate-400 dark:text-zinc-550 font-bold font-outfit uppercase tracking-wider">
              {isPending ? "Find the statement that is a lie!" : "Game completed"}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {statements.map((statement, idx) => {
            let btnStyle = "border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/30 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer";
            let badge = "";

            if (!isPending) {
              if (idx === lieIndex) {
                btnStyle = "border-emerald-300 dark:border-emerald-800 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold cursor-default";
                badge = "The Lie 🚫";
              } else if (idx === guessIndex) {
                btnStyle = "border-rose-300 dark:border-rose-800 bg-rose-500/10 text-rose-700 dark:text-rose-300 cursor-default";
                badge = isSentByMe ? `${activeChatUserName}'s Guess` : "Your Guess";
              } else {
                btnStyle = "border-slate-100 dark:border-zinc-900 bg-slate-50/10 dark:bg-zinc-950/10 text-slate-400 dark:text-zinc-600 opacity-60 cursor-default";
              }
            } else {
              if (isSentByMe && idx === lieIndex) {
                btnStyle = "border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-955/5 text-rose-600 dark:text-rose-450 cursor-default";
                badge = "The Lie 🚫";
              } else if (isSentByMe) {
                btnStyle = "border-slate-100 dark:border-zinc-900 bg-slate-50/20 dark:bg-zinc-950/20 text-slate-500 dark:text-zinc-400 cursor-default";
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
                      ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-220/20"
                      : "bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-220/20"
                  }`}>
                    {badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {isPending && isSentByMe && (
          <div className="flex items-center justify-center space-x-1.5 text-center text-[10px] text-slate-400 dark:text-zinc-550 bg-slate-50/40 dark:bg-zinc-950/20 rounded-xl py-2 font-outfit font-bold tracking-wide select-none">
            <Clock size={11} />
            <span>Awaiting {activeChatUserName}&apos;s guess</span>
          </div>
        )}

        <span className="block text-[8px] mt-2.5 text-right font-medium text-slate-400 dark:text-slate-550 font-sans select-none">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
