import { useState, useEffect, useCallback } from "react";

export function useReactions(id) {
  const [reactions, setReactions] = useState({});
  const [activeReactionPickerMessageId, setActiveReactionPickerMessageId] =
    useState(null);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(`reactions-${id}`);
      setReactions(saved ? JSON.parse(saved) : {});
      setActiveReactionPickerMessageId(null);
    }
  }, [id]);

  useEffect(() => {
    if (id && Object.keys(reactions).length > 0) {
      localStorage.setItem(`reactions-${id}`, JSON.stringify(reactions));
    }
  }, [reactions, id]);

  const addReaction = useCallback(
    (messageId, emoji) => {
      setReactions((prev) => {
        const updated = { ...prev };
        if (emoji === null) {
          delete updated[messageId];
        } else {
          updated[messageId] = emoji;
        }
        localStorage.setItem(`reactions-${id}`, JSON.stringify(updated));
        return updated;
      });
    },
    [id],
  );

  const toggleReactionPicker = useCallback((messageId) => {
    setActiveReactionPickerMessageId((prev) =>
      prev === messageId ? null : messageId,
    );
  }, []);

  return {
    reactions,
    activeReactionPickerMessageId,
    addReaction,
    toggleReactionPicker,
  };
}
