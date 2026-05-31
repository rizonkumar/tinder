import { Sparkles, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import LoadingState from "../../../components/common/LoadingState";

export default function AIAssistantPanel({
  aiTab,
  onSetAiTab,
  smartReplies,
  isLoadingSmartReplies,
  icebreakers,
  isLoadingIcebreakers,
  onSelectReply,
  onRegenerateReplies,
  onRegenerateIcebreakers,
  chatId,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b border-slate-200/50 dark:border-zinc-800 p-3 bg-pink-50/10 dark:bg-zinc-950/20 space-y-3 rounded-t-3xl overflow-hidden shrink-0 border-t border-t-pink-100/10 dark:border-t-zinc-900/20 shadow-inner"
    >
      <div className="flex items-center justify-between shrink-0 font-outfit border-b border-slate-100 dark:border-zinc-800/80 pb-2">
        <div className="flex space-x-1 bg-slate-100 dark:bg-zinc-900/60 p-0.5 rounded-xl">
          <button
            type="button"
            onClick={() => onSetAiTab("replies")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all duration-200 ${
              aiTab === "replies"
                ? "bg-white dark:bg-zinc-800 text-pink-500 shadow-sm"
                : "text-slate-400 hover:text-slate-655 dark:hover:text-zinc-300"
            }`}
          >
            <Sparkles size={11} />
            <span>Smart Replies</span>
          </button>
          <button
            type="button"
            onClick={() => onSetAiTab("icebreakers")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all duration-200 ${
              aiTab === "icebreakers"
                ? "bg-white dark:bg-zinc-800 text-pink-500 shadow-sm"
                : "text-slate-400 hover:text-slate-655 dark:hover:text-zinc-300"
            }`}
          >
            <MessageCircle size={11} />
            <span>Icebreakers</span>
          </button>
        </div>

        {aiTab === "icebreakers" && (
          <button
            type="button"
            onClick={onRegenerateIcebreakers}
            className="text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 text-[10px] font-bold transition-colors duration-200 focus:outline-none select-none shrink-0"
          >
            Regenerate
          </button>
        )}
        {aiTab === "replies" && (
          <button
            type="button"
            onClick={onRegenerateReplies}
            className="text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 text-[10px] font-bold transition-colors duration-200 focus:outline-none select-none shrink-0"
          >
            Regenerate
          </button>
        )}
      </div>

      {aiTab === "replies" ? (
        isLoadingSmartReplies ? (
          <div className="flex py-4 justify-center">
            <LoadingState message="" type="inline" />
          </div>
        ) : (
          <div className="flex flex-col space-y-1.5 max-h-36 overflow-y-auto overflow-x-hidden scrollbar-none pb-1">
            {smartReplies.length > 0 ? (
              smartReplies.map((reply, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectReply(reply)}
                  className="w-full text-left bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-pink-50/20 dark:hover:bg-zinc-800 hover:border-pink-500/30 dark:hover:border-pink-500/30 transition-all font-medium leading-relaxed shadow-sm font-sans"
                >
                  {reply}
                </button>
              ))
            ) : (
              <div className="text-center text-[10px] text-slate-400 py-3 italic font-medium">
                No suggestions available. Try chatting more first!
              </div>
            )}
          </div>
        )
      ) : isLoadingIcebreakers ? (
        <div className="flex py-4 justify-center">
          <LoadingState message="" type="inline" />
        </div>
      ) : (
        <div className="flex flex-col space-y-1.5 max-h-36 overflow-y-auto overflow-x-hidden scrollbar-none pb-1">
          {icebreakers.length > 0 ? (
            icebreakers.map((starter, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectReply(starter)}
                className="w-full text-left bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-pink-50/20 dark:hover:bg-zinc-800 hover:border-pink-500/30 dark:hover:border-pink-500/30 transition-all font-medium leading-relaxed shadow-sm font-sans whitespace-normal break-words"
              >
                {starter}
              </button>
            ))
          ) : (
            <div className="text-center text-[10px] text-slate-400 py-3 italic font-medium">
              No icebreakers available. Click regenerate to fetch!
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
