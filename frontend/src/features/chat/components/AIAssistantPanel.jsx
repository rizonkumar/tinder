import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";

const AI_TABS = [
  { value: "replies", label: "Reply ideas" },
  { value: "icebreakers", label: "Icebreakers" },
];

const EMPTY_COPY = {
  replies: "No reply ideas yet. Send a few messages first, then try again.",
  icebreakers: "No icebreakers yet. Select regenerate to get a few.",
};

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
  const isReplies = aiTab === "replies";
  const items = isReplies ? smartReplies : icebreakers;
  const isLoading = isReplies ? isLoadingSmartReplies : isLoadingIcebreakers;
  const onRegenerate = isReplies ? onRegenerateReplies : onRegenerateIcebreakers;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="overflow-hidden border-b border-border bg-background-secondary"
    >
      <div className="mx-auto w-full max-w-3xl space-y-3 px-3 py-3 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <SegmentedControl size="sm" label="Wingman mode" className="w-auto" options={AI_TABS} value={aiTab} onChange={onSetAiTab} />
          <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={isLoading}>
            <RefreshCw className={isLoading ? "animate-spin" : undefined} aria-hidden="true" />
            Regenerate
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2" aria-label="Loading suggestions">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} className="h-10 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="copy-13 py-2 text-foreground-muted">{EMPTY_COPY[aiTab]}</p>
        ) : (
          <ul className="max-h-44 space-y-1.5 overflow-y-auto">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => onSelectReply(item)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-left copy-13 text-foreground transition-colors hover:border-border-strong hover:bg-surface-raised focus-ring"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
