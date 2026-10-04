import { useState } from "react";
import { Gamepad2, AlertCircle } from "lucide-react";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Field";
import { cn } from "../../../../utils/cn";

const STATEMENT_COUNT = 3;
const PLACEHOLDERS = [
  "I once got lost in Tokyo for a whole day",
  "I have a cat called Biscuit",
  "I can speak four languages",
];
const FORM_ID = "two-truths-form";

export default function TwoTruthsLieModal({ isOpen, activeChatUser, onClose, onSendChallenge }) {
  const [statements, setStatements] = useState(() => Array(STATEMENT_COUNT).fill(""));
  const [lieIndex, setLieIndex] = useState(null);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const reset = () => {
    setStatements(Array(STATEMENT_COUNT).fill(""));
    setLieIndex(null);
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const updateStatement = (index, value) =>
    setStatements((prev) => prev.map((item, current) => (current === index ? value : item)));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (statements.some((item) => !item.trim())) {
      setError("Write all three statements.");
      return;
    }
    if (lieIndex === null) {
      setError("Mark which statement is the lie.");
      return;
    }
    setIsSending(true);
    await onSendChallenge("Challenged you to two truths and a lie", "game_ttal", "", null, {
      statements: statements.map((item) => item.trim()),
      lieIndex,
    });
    setIsSending(false);
    handleClose();
  };

  return (
    <Modal
      open={isOpen && !!activeChatUser}
      onClose={handleClose}
      icon={Gamepad2}
      title="Two truths and a lie"
      description={activeChatUser ? `Write three statements and mark the lie. ${activeChatUser.name} gets one guess.` : undefined}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={isSending}>
            Send challenge
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4 p-5" noValidate>
        {statements.map((statement, index) => {
          const isLie = lieIndex === index;
          const inputId = `statement-${index}`;
          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor={inputId} className="label-13 text-foreground">
                  Statement {index + 1}
                </label>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isLie}
                  onClick={() => setLieIndex(index)}
                  className={cn(
                    "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors focus-ring",
                    isLie
                      ? "border-danger/40 bg-danger-surface text-danger"
                      : "border-border text-foreground-secondary hover:border-border-strong hover:text-foreground"
                  )}
                >
                  <span className={cn("size-2 rounded-full border", isLie ? "border-danger bg-danger" : "border-foreground-muted")} />
                  {isLie ? "This is the lie" : "Mark as lie"}
                </button>
              </div>
              <Input
                id={inputId}
                value={statement}
                onChange={(event) => updateStatement(index, event.target.value)}
                placeholder={PLACEHOLDERS[index]}
                className={isLie ? "border-danger/40" : undefined}
              />
            </div>
          );
        })}
        {error && (
          <p className="flex items-center gap-2 copy-13 text-danger" role="alert">
            <AlertCircle size={14} aria-hidden="true" />
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
