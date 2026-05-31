import { useState, useRef, useCallback } from "react";
import { useMessageStore } from "../../../store/useMessageStore";

export function useTypingIndicator() {
  const [text, setText] = useState("");
  const [isCurrentlyTypingEmit, setIsCurrentlyTypingEmit] = useState(false);
  const typingTimeoutRef = useRef(null);

  const sendTypingStatus = useMessageStore((state) => state.sendTypingStatus);
  const sendMessage = useMessageStore((state) => state.sendMessage);

  const handleTextChange = useCallback(
    (e) => {
      const val = e.target.value;
      setText(val);

      if (val.trim()) {
        if (!isCurrentlyTypingEmit) {
          setIsCurrentlyTypingEmit(true);
          sendTypingStatus(true);
        }

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          setIsCurrentlyTypingEmit(false);
          sendTypingStatus(false);
        }, 1500);
      } else {
        if (isCurrentlyTypingEmit) {
          setIsCurrentlyTypingEmit(false);
          sendTypingStatus(false);
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },
    [isCurrentlyTypingEmit, sendTypingStatus],
  );

  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();
      if (!text.trim()) return;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setIsCurrentlyTypingEmit(false);
      sendTypingStatus(false);

      await sendMessage(text.trim());
      setText("");
    },
    [text, sendTypingStatus, sendMessage],
  );

  return { text, setText, handleTextChange, handleSend };
}
