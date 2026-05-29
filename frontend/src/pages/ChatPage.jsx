import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";
import { useMessageStore } from "../store/useMessageStore";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/Sidebar";
import { Header } from "../components/Header";
import { Send, ArrowLeft, Heart, Loader, Sparkles, Phone, Video, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallStore } from "../store/useCallStore";

const ChatPage = () => {
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
  } = useMessageStore();

  const [text, setText] = useState("");
  const [showIcebreakers, setShowIcebreakers] = useState(false);
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
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(text.trim());
    setText("");
    setShowIcebreakers(false);
  };

  const isOnline = activeChatUser
    ? onlineUsers.includes(activeChatUser._id)
    : false;

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 lg:flex-row">
      <Sidebar />
      <div className="flex flex-grow flex-col overflow-hidden bg-white/40 backdrop-blur-sm lg:w-3/4">
        <Header />

        {activeChatUser ? (
          <div className="flex flex-grow flex-col overflow-hidden bg-white shadow-xl rounded-t-3xl border-t border-pink-100 lg:m-4 lg:rounded-3xl">
            <div className="flex items-center justify-between border-b border-pink-100 p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-gray-500 hover:text-pink-500 lg:hidden"
                >
                  <ArrowLeft size={24} />
                </Link>
                <div className="relative">
                  <img
                    src={activeChatUser.image || "/avatar.png"}
                    alt={activeChatUser.name}
                    className="h-12 w-12 rounded-full border-2 border-pink-200 object-cover shadow-sm"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">
                    {activeChatUser.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isOnline ? (
                      <span className="flex items-center text-green-500 font-medium">
                        Active now
                      </span>
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>
              </div>

              {isOnline && (
                <div className="flex items-center space-x-3.5 mr-2">
                  <button
                    onClick={() => initiateCall(activeChatUser._id, "voice")}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500 transition-colors"
                  >
                    <Phone size={18} />
                  </button>
                  <button
                    onClick={() => initiateCall(activeChatUser._id, "video")}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500 transition-colors"
                  >
                    <Video size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-pink-50/20 to-purple-50/20">
              {isLoadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <Loader className="animate-spin text-pink-500" size={36} />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow-inner">
                    <Heart size={26} className="fill-current animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Say Hello!
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs mt-1">
                    You matched with {activeChatUser.name}. Break the ice and
                    send a message!
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const isSentByMe =
                    message.sender === authUser?._id ||
                    message.sender?._id === authUser?._id;
                  const isCallLog = message.messageType === "audio" || message.messageType === "video";

                  if (isCallLog) {
                    const isMissed = message.content.toLowerCase().includes("missed");
                    const CallIcon = message.messageType === "video" ? Video : Phone;

                    return (
                      <div
                        key={message._id}
                        className="flex justify-center my-1.5"
                      >
                        <div className="flex items-center space-x-3 rounded-2xl bg-pink-50/20 border border-pink-100/30 px-4 py-2 text-xs font-bold text-gray-600 shadow-sm select-none">
                          <CallIcon size={14} className={isMissed ? "text-red-500 animate-pulse" : "text-green-500"} />
                          <span>{message.content}</span>
                          <span className="text-[9px] text-gray-400 font-medium ml-1.5">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
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
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                          isSentByMe
                            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-tr-none"
                            : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                        }`}
                      >
                        <p>{message.content}</p>
                        <span
                          className={`block text-[10px] mt-1 text-right ${
                            isSentByMe ? "text-pink-100" : "text-gray-400"
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
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="border-t border-pink-100 bg-white relative flex flex-col"
            >
              <AnimatePresence>
                {showIcebreakers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-pink-100 p-3 bg-pink-50/40 backdrop-blur-sm space-y-2 rounded-t-2xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-pink-600 uppercase tracking-wider">
                      <span>AI Icebreakers ✨</span>
                      <button
                        type="button"
                        onClick={() => getIcebreakers(id)}
                        className="text-gray-400 hover:text-pink-600 font-semibold"
                      >
                        Regenerate
                      </button>
                    </div>
                    {isLoadingIcebreakers ? (
                      <div className="flex py-2 justify-center">
                        <Loader className="animate-spin text-pink-500" size={20} />
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-1.5 max-h-36 overflow-y-auto">
                        {icebreakers.map((starter, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setText(starter);
                              setShowIcebreakers(false);
                            }}
                            className="w-full text-left bg-white border border-pink-50 rounded-xl px-3 py-2 text-xs text-gray-700 hover:bg-pink-50 hover:border-pink-200 transition-all font-medium leading-relaxed"
                          >
                            {starter}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center space-x-3 p-4">
                <button
                  type="button"
                  onClick={() => setShowIcebreakers(!showIcebreakers)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 transition-colors"
                >
                  <Sparkles size={18} />
                </button>

                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow rounded-full border border-pink-100 bg-pink-50/20 px-5 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-pink-300 focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 focus:outline-none"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 select-none">
            <div className="hidden h-full flex-col items-center justify-center text-center p-8 bg-white/30 backdrop-blur-md rounded-3xl m-4 border border-pink-100 shadow-xl lg:flex lg:flex-grow">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow-inner">
                <Heart size={36} className="fill-current animate-beat" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                Your Chats
              </h2>
              <p className="text-gray-500 max-w-sm mt-2">
                Select a match from the sidebar list to start exchanging sweet
                messages and setting up dates!
              </p>
            </div>

            <div className="flex flex-col flex-grow lg:hidden">
              <div className="flex items-center space-x-3 mb-6">
                <div className="rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 p-2.5 text-white shadow-md shadow-pink-500/10">
                  <MessageCircle size={22} />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-gray-800">
                  Messages
                </h1>
              </div>

              {isLoadingMyMatches ? (
                <div className="flex flex-grow items-center justify-center py-20">
                  <Loader className="animate-spin text-pink-500" size={32} />
                </div>
              ) : matches?.length === 0 ? (
                <div className="flex flex-grow flex-col items-center justify-center rounded-3xl border border-pink-100 bg-white/60 p-6 text-center shadow-xl backdrop-blur-sm py-16">
                  <div className="mb-3.5 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow-inner">
                    <Heart size={28} className="fill-current animate-pulse" />
                  </div>
                  <h2 className="text-xl font-black text-gray-800">
                    No Matches Yet
                  </h2>
                  <p className="max-w-xs text-xs text-gray-500 mt-1.5 leading-relaxed">
                    Once you match with someone, they will appear here so you can start chatting!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((match) => {
                    const isOnline = onlineUsers.includes(match._id);
                    return (
                      <Link
                        key={match._id}
                        to={`/chat/${match._id}`}
                        className="flex items-center rounded-2xl border border-pink-100/30 bg-white/80 p-3.5 shadow-sm transition-all hover:bg-pink-50/20 active:scale-[0.99]"
                      >
                        <div className="relative mr-3.5">
                          <img
                            src={match.image || "/avatar.png"}
                            alt={match.name}
                            className="h-12 w-12 rounded-full border-2 border-pink-200 object-cover shadow-sm"
                          />
                          <span
                            className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ${
                              isOnline ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-gray-800 text-base leading-snug">
                            {match.name}
                          </h3>
                          <p className="text-xs text-gray-500 leading-none mt-1">
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
};

export default ChatPage;
