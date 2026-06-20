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
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b border-border p-3 bg-background-secondary space-y-3 rounded-t-3xl overflow-hidden shrink-0 border-t border-t-border"
    >
      <div className="flex items-center justify-between shrink-0 font-outfit border-b border-border pb-2">
        <div className="flex space-x-1 bg-background p-0.5 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => onSetAiTab("replies")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all duration-200 ${
              aiTab === "replies"
                ? "bg-surface-active text-accent shadow-card"
                : "text-foreground-muted hover:text-foreground"
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
                ? "bg-surface-active text-accent shadow-card"
                : "text-foreground-muted hover:text-foreground"
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
            className="text-foreground-muted hover:text-accent text-[10px] font-bold transition-colors duration-200 focus:outline-none select-none shrink-0"
          >
            Regenerate
          </button>
        )}
        {aiTab === "replies" && (
          <button
            type="button"
            onClick={onRegenerateReplies}
            className="text-foreground-muted hover:text-accent text-[10px] font-bold transition-colors duration-200 focus:outline-none select-none shrink-0"
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
                  className="w-full text-left bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground-secondary hover:bg-surface-hover hover:border-border-strong transition-all font-medium leading-relaxed shadow-card font-sans"
                >
                  {reply}
                </button>
              ))
            ) : (
              <div className="text-center text-[10px] text-foreground-muted py-3 italic font-medium">
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
                className="w-full text-left bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground-secondary hover:bg-surface-hover hover:border-border-strong transition-all font-medium leading-relaxed shadow-card font-sans whitespace-normal break-words"
              >
                {starter}
              </button>
            ))
          ) : (
            <div className="text-center text-[10px] text-foreground-muted py-3 italic font-medium">
              No icebreakers available. Click regenerate to fetch!
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
