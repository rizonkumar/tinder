import { Gamepad2, Check, X, CircleDashed } from "lucide-react";
import confetti from "canvas-confetti";
import { Badge } from "../../../components/ui/Badge";
import ChatCard from "./ChatCard";
import { cn } from "../../../utils/cn";

const STATUS = {
  pending: { tone: "neutral", label: "Open", icon: CircleDashed },
  correct: { tone: "success", label: "Solved", icon: Check },
  incorrect: { tone: "danger", label: "Missed", icon: X },
};

const CONFETTI_COLORS = ["#2f7d4a", "#a67c1a", "#c43d22"];

function statementState({ index, isPending, isSentByMe, lieIndex, guessIndex }) {
  if (index === lieIndex && (!isPending || isSentByMe)) return "lie";
  if (!isPending && index === guessIndex) return "wrong-guess";
  if (!isPending) return "dimmed";
  return isSentByMe ? "static" : "choice";
}

const STATEMENT_STYLES = {
  choice: "border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-raised cursor-pointer",
  static: "border-border bg-surface text-foreground-secondary",
  lie: "border-success/30 bg-success-surface text-foreground",
  "wrong-guess": "border-danger/30 bg-danger-surface text-foreground",
  dimmed: "border-border bg-surface text-foreground-muted",
};

export default function TwoTruthsLieCard({ message, isSentByMe, isHighlighted, activeChatUserName, onRespond }) {
  const info = message.gameInfo || {};
  const statements = info.statements || [];
  const statusKey = info.status || "pending";
  const isPending = statusKey === "pending";
  const { guessIndex, lieIndex } = info;

  const handleGuess = async (index) => {
    if (!isPending || isSentByMe) return;
    if (index === lieIndex) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 }, colors: CONFETTI_COLORS });
    }
    await onRespond(message._id, index);
  };

  const footerCopy = isPending
    ? isSentByMe
      ? `Waiting for ${activeChatUserName} to guess`
      : "Tap the statement you think is the lie"
    : statusKey === "correct"
      ? isSentByMe
        ? `${activeChatUserName} spotted the lie`
        : "You spotted the lie"
      : isSentByMe
        ? `${activeChatUserName} guessed wrong`
        : "Not quite. The lie is highlighted";

  return (
    <ChatCard
      message={message}
      isSentByMe={isSentByMe}
      isHighlighted={isHighlighted}
      icon={Gamepad2}
      eyebrow="Two truths and a lie"
      title={isSentByMe ? "Your challenge" : `${activeChatUserName}'s challenge`}
      status={STATUS[statusKey]}
      footer={<span className="text-xs text-foreground-secondary">{footerCopy}</span>}
    >
      <ol className="space-y-2">
        {statements.map((statement, index) => {
          const state = statementState({ index, isPending, isSentByMe, lieIndex, guessIndex });
          const isChoice = state === "choice";
          return (
            <li key={index}>
              <button
                type="button"
                disabled={!isChoice}
                onClick={() => handleGuess(index)}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left text-[0.8125rem] leading-5 transition-colors focus-ring disabled:cursor-default",
                  STATEMENT_STYLES[state]
                )}
              >
                <span className="tabular mt-px shrink-0 text-xs text-foreground-muted">{index + 1}</span>
                <span className="min-w-0 flex-1">{statement}</span>
                {state === "lie" && <Badge tone="success" className="h-5 px-2 text-[11px]">Lie</Badge>}
                {state === "wrong-guess" && (
                  <Badge tone="danger" className="h-5 px-2 text-[11px]">{isSentByMe ? "Their guess" : "Your guess"}</Badge>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </ChatCard>
  );
}
