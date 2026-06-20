import { useState } from "react";
import { Gamepad2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING_TRANSITION = { type: "spring", stiffness: 350, damping: 25 };

export default function TwoTruthsLieModal({
  isOpen,
  activeChatUser,
  onClose,
  onSendChallenge,
}) {
  const [statements, setStatements] = useState(["", "", ""]);
  const [lieIndex, setLieIndex] = useState(null);
  const [validationError, setValidationError] = useState("");

  const resetState = () => {
    setStatements(["", "", ""]);
    setLieIndex(null);
    setValidationError("");
  };

  const handleStatementChange = (index, value) => {
    const updated = [...statements];
    updated[index] = value;
    setStatements(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (statements.some((s) => !s.trim())) {
      setValidationError("Please fill out all 3 statements.");
      return;
    }

    if (lieIndex === null) {
      setValidationError("Please select which statement is the Lie.");
      return;
    }

    const payload = {
      statements: statements.map((s) => s.trim()),
      lieIndex: Number(lieIndex),
    };

    await onSendChallenge(
      "Challenged you to Two Truths & a Lie! 🎮",
      "game_ttal",
      "",
      null,
      payload
    );

    resetState();
    onClose();
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && activeChatUser && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={SPRING_TRANSITION}
            className="w-full max-w-md bg-background border border-border shadow-modal p-6 font-sans text-foreground rounded-lg relative overflow-visible"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold tracking-tight text-foreground font-outfit flex items-center gap-2 select-none">
                <Gamepad2 size={18} className="text-accent" />
                <span>Challenge {activeChatUser.name}</span>
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-foreground-muted hover:text-foreground-secondary focus:outline-none"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-foreground-muted mb-5 font-sans leading-relaxed select-none">
              Create a challenge by writing three statements: two that are true, and one that is a lie. Select the statement that is the lie before sending!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {statements.map((statement, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-outfit select-none">
                      Statement {idx + 1}
                    </label>
                    <button
                      type="button"
                      onClick={() => setLieIndex(idx)}
                      className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all select-none ${
                        lieIndex === idx
                          ? "bg-red-800 text-white border-red-800 shadow-card"
                          : "bg-background-secondary text-foreground-secondary border-border hover:bg-surface-hover"
                      }`}
                    >
                      {lieIndex === idx ? "The Lie 🚫" : "Set as Lie"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={statement}
                    onChange={(e) => handleStatementChange(idx, e.target.value)}
                    required
                    placeholder={`e.g. ${
                      idx === 0
                        ? "I once climbed Mt. Fuji during a storm."
                        : idx === 1
                          ? "I have a pet hedgehog named Pip."
                          : "I can speak four languages fluently."
                    }`}
                    className="w-full text-xs rounded-md border border-border bg-background px-4 py-2.5 focus-ring text-foreground placeholder:text-foreground-muted"
                  />
                </div>
              ))}

              <AnimatePresence>
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center space-x-2 text-red-800 text-xs font-semibold py-1 select-none"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{validationError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2 flex items-center space-x-3 w-full">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 text-center text-xs font-bold text-foreground-secondary border border-border rounded-md hover:bg-surface-hover transition-all font-outfit focus:outline-none select-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-center text-xs font-bold text-primary-foreground bg-primary hover:bg-primary-hover rounded-md transition-colors font-outfit focus:outline-none flex items-center justify-center space-x-2 select-none"
                >
                  <Gamepad2 size={14} />
                  <span>Send Challenge</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
