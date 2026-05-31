import { useEffect, useRef } from "react";
import { useMatchStore } from "../../../store/useMatchStore";
import { useMessageStore } from "../../../store/useMessageStore";

export function useChatInit(id) {
  const { getMyMatches, matches } = useMatchStore();
  const {
    setActiveChatUser,
    getMessages,
    messages,
    getIcebreakers,
    subscribeToMessages,
    unsubscribeFromMessages,
    isTypingUser,
  } = useMessageStore();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    getMyMatches();
  }, [getMyMatches]);

  useEffect(() => {
    if (id && matches.length > 0) {
      const match = matches.find((m) => m._id === id);
      if (match) {
        setActiveChatUser(match);
        getMessages(id);
        getIcebreakers(id);
      } else {
        setActiveChatUser(null);
      }
    } else {
      setActiveChatUser(null);
    }
  }, [id, matches, setActiveChatUser, getMessages, getIcebreakers]);

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [id, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTypingUser]);

  return { messagesEndRef };
}
