import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMatchStore } from "../../store/useMatchStore";
import { useMessageStore } from "../../store/useMessageStore";
import { useAuthStore } from "../../store/useAuthStore";
import Sidebar from "../../components/Sidebar";
import { Header } from "../../components/Header";
import {
  Send,
  ArrowLeft,
  Heart,
  Sparkles,
  Phone,
  Video,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallStore } from "../../store/useCallStore";
import LoadingState from "../../components/common/LoadingState";
import FallbackState from "../../components/common/FallbackState";

export default function ChatPage() {
  const { id } = useParams();
  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
  const { authUser, onlineUsers } = useAuthStore();
  const initiateCall = useCallStore((state) => state.initiateCall);
  const {
    activeChatUser,
    setActiveChatUser,
    getMessages,
    messages,
    sendMessage,
    isLoadingMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    icebreakers,
    isLoadingIcebreakers,
    getIcebreakers,
    isTypingUser,
    sendTypingStatus,
  } = useMessageStore();

  const [text, setText] = useState("");
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isCurrentlyTypingEmit, setIsCurrentlyTypingEmit] = useState(false);

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

  const handleTextChange = (e) => {
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
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsCurrentlyTypingEmit(false);
    sendTypingStatus(false);

    await sendMessage(text.trim());
    setText("");
    setShowIcebreakers(false);
  };

  const isOnline = activeChatUser
    ? onlineUsers.includes(activeChatUser._id)
    : false;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 lg:flex-row transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-grow flex-col overflow-hidden lg:w-3/4">
        <Header />

        {activeChatUser ? (
          <div className="flex flex-grow flex-col overflow-hidden bg-white dark:bg-zinc-900 border-t border-slate-200/60 dark:border-zinc-800 lg:border-l lg:border-t-0 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 p-4 shrink-0 bg-white dark:bg-zinc-900 z-10">
              <div className="flex items-center space-x-4">
                <Link
                  to="/chat"
                  className="text-slate-400 hover:text-pink-500 lg:hidden transition-colors"
                >
                  <ArrowLeft size={22} />
                </Link>
                <div className="relative">
                  <img
                    src={activeChatUser.image || "/avatar.png"}
                    alt={activeChatUser.name}
                    className="h-11 w-11 rounded-full border border-slate-200/50 dark:border-zinc-800 object-cover shadow-sm"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                      isOnline ? "bg-green-500" : "bg-slate-300 dark:bg-zinc-700"
                    }`}
                  />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-zinc-200 leading-tight font-outfit">
                    {activeChatUser.name}
                  </h2>
                  <div className="text-[11px] mt-0.5 font-medium">
                    {isOnline ? (
                      <span className="text-green-500 font-semibold font-outfit">
                        Active now
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 font-outfit">
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isOnline && (
                <div className="flex items-center space-x-3 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => initiateCall(activeChatUser._id, "voice")}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
                  >
                    <Phone size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => initiateCall(activeChatUser._id, "video")}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
                  >
                    <Video size={16} />
                  </motion.button>
                </div>
              )}
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-zinc-950/40 select-none">
              {isLoadingMessages ? (
                <LoadingState message="Fetching conversations..." />
              ) : messages.length === 0 ? (
                <FallbackState
                  icon={Heart}
                  title="Say Hello!"
                  description={`You matched with ${activeChatUser.name}. Break the ice and send a message!`}
                />
              ) : (
                messages.map((message) => {
                  const isSentByMe =
                    message.sender === authUser?._id ||
                    message.sender?._id === authUser?._id;
                  const isCallLog =
                    message.messageType === "audio" ||
                    message.messageType === "video";

                  if (isCallLog) {
                    const isMissed = message.content
                      .toLowerCase()
                      .includes("missed");
                    const CallIcon =
                      message.messageType === "video" ? Video : Phone;

                    return (
                      <div
                        key={message._id}
                        className="flex justify-center my-2"
                      >
                        <div className="flex items-center space-x-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 shadow-sm">
                          <CallIcon
                            size={13}
                            className={
                              isMissed
                                ? "text-red-500 animate-pulse"
                                : "text-green-500"
                            }
                          />
                          <span className="font-outfit">{message.content}</span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium ml-1">
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={message._id}
                      className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed font-sans ${
                          isSentByMe
                            ? "bg-pink-500 text-white rounded-tr-none"
                            : "bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200/45 dark:border-zinc-800/80 rounded-tl-none font-medium"
                        }`}
                      >
                        <p>{message.content}</p>
                        <span
                          className={`block text-[9px] mt-1.5 text-right font-medium font-sans ${
                            isSentByMe ? "text-pink-100" : "text-slate-400 dark:text-slate-550"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {isTypingUser && (
                <div className="flex justify-start my-2 animate-pulse">
                  <div className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200/40 dark:border-zinc-800/80 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm text-xs flex items-center space-x-1.5 font-outfit">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-outfit pr-0.5">{activeChatUser.name} is typing</span>
                    <div className="flex items-center space-x-1 h-3">
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="border-t border-slate-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shrink-0 relative flex flex-col z-10"
            >
              <AnimatePresence>
                {showIcebreakers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-slate-200/50 dark:border-zinc-800 p-3 bg-slate-50 dark:bg-zinc-900/80 space-y-2 rounded-t-2xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider font-outfit shrink-0">
                      <span className="whitespace-nowrap">AI Icebreakers ✨</span>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => getIcebreakers(id)}
                        className="text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 font-bold transition-colors focus:outline-none select-none shrink-0 whitespace-nowrap"
                      >
                        Regenerate
                      </motion.button>
                    </div>
                    {isLoadingIcebreakers ? (
                      <div className="flex py-2 justify-center">
                        <LoadingState message="" type="inline" />
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-1.5 max-h-36 overflow-y-auto">
                        {icebreakers.map((starter, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="button"
                            onClick={() => {
                              setText(starter);
                              setShowIcebreakers(false);
                            }}
                            className="w-full text-left bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-pink-500/30 dark:hover:border-pink-500/30 transition-all font-medium leading-relaxed shadow-sm font-sans"
                          >
                            {starter}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center space-x-3 p-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowIcebreakers(!showIcebreakers)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 text-slate-500 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors focus:outline-none shrink-0"
                >
                  <Sparkles size={17} />
                </motion.button>

                <input
                  type="text"
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Type a message..."
                  className="flex-grow rounded-full border border-slate-200/60 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 px-5 py-2.5 text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-pink-500 dark:focus:border-pink-500 focus:bg-white dark:focus:bg-zinc-950"
                />

                <motion.button
                  whileHover={{ scale: text.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: text.trim() ? 0.95 : 1 }}
                  type="submit"
                  disabled={!text.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm transition-all hover:bg-pink-600 active:bg-pink-700 disabled:bg-slate-100 dark:disabled:bg-zinc-900 disabled:text-slate-400 dark:disabled:text-zinc-500 disabled:shadow-none focus:outline-none shrink-0"
                >
                  <Send size={16} className="ml-0.5" />
                </motion.button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-zinc-950 select-none">
            <FallbackState
              icon={Heart}
              title="Your Chats"
              description="Select a match from the sidebar list to start exchanging sweet messages and setting up dates!"
              className="hidden bg-white dark:bg-zinc-900 rounded-3xl m-4 border border-slate-200/50 dark:border-zinc-800/80 shadow-sm lg:flex lg:flex-grow"
            />

            <div className="flex flex-col flex-grow lg:hidden">
              <div className="flex items-center space-x-3 mb-6">
                <div className="rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-100/40 dark:border-pink-900/30 p-2.5 text-pink-600 dark:text-pink-400">
                  <MessageCircle size={22} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-zinc-100 font-outfit">
                  MESSAGES
                </h1>
              </div>

              {isLoadingMyMatches ? (
                <div className="flex flex-grow items-center justify-center py-20">
                  <LoadingState message="" type="inline" />
                </div>
              ) : matches?.length === 0 ? (
                <FallbackState
                  icon={Heart}
                  title="No Matches Yet"
                  description="Once you match with someone, they will appear here so you can start chatting!"
                  className="border border-slate-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm py-16 rounded-3xl"
                />
              ) : (
                <div className="space-y-3">
                  {matches.map((match) => {
                    const isOnline = onlineUsers.includes(match._id);
                    return (
                      <Link
                        key={match._id}
                        to={`/chat/${match._id}`}
                        className="flex items-center rounded-2xl border border-slate-200/50 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 p-3.5 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-[0.99]"
                      >
                        <div className="relative mr-3.5">
                          <img
                            src={match.image || "/avatar.png"}
                            alt={match.name}
                            className="h-11 w-11 rounded-full border border-slate-200/50 dark:border-zinc-800 object-cover shadow-sm"
                          />
                          <span
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm ${
                              isOnline ? "bg-green-500" : "bg-slate-300 dark:bg-zinc-700"
                            }`}
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-base leading-snug font-outfit">
                            {match.name}
                          </h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 leading-none mt-1">
                            {isOnline ? "Active now" : "Offline"}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
