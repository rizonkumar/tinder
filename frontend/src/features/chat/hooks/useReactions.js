import { useState, useEffect, useCallback } from "react";
import { useMessageStore } from "../../../store/useMessageStore";

export function useReactions(id) {
  const messages = useMessageStore((state) => state.messages);
  const toggleReaction = useMessageStore((state) => state.toggleReaction);
  const [reactions, setReactions] = useState({});
  const [activeReactionPickerMessageId, setActiveReactionPickerMessageId] =
    useState(null);

  useEffect(() => {
    if (id) {
      setActiveReactionPickerMessageId(null);
    }
  }, [id]);

  useEffect(() => {
    const map = {};
    messages.forEach((m) => {
      if (m.reactions && m.reactions.length > 0) {
        map[m._id] = m.reactions[m.reactions.length - 1].emoji;
      }
    });
    setReactions(map);
  }, [messages]);

  const addReaction = useCallback(
    (messageId, emoji) => {
      toggleReaction(messageId, emoji);
    },
    [toggleReaction],
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
