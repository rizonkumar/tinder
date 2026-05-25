import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";
import { useMessageStore } from "../store/useMessageStore";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/Sidebar";
import { Header } from "../components/Header";
import { Send, ArrowLeft, Heart, Loader } from "lucide-react";
import { motion } from "framer-motion";

const ChatPage = () => {
  const { id } = useParams();
  const { getMyMatches, matches } = useMatchStore();
  const { authUser, onlineUsers } = useAuthStore();
  const {
    activeChatUser,
    setActiveChatUser,
    getMessages,
    messages,
    sendMessage,
    isLoadingMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useMessageStore();

  const [text, setText] = useState("");
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
      }
    }
  }, [id, matches, setActiveChatUser, getMessages]);

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
            {/* Conversation Header */}
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
            </div>

            {/* Messages Display Area */}
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
              className="border-t border-pink-100 p-4 bg-white"
            >
              <div className="flex items-center space-x-3">
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
          <div className="hidden h-full flex-col items-center justify-center text-center p-8 bg-white/30 backdrop-blur-md rounded-3xl m-4 border border-pink-100 shadow-xl lg:flex">
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
        )}
      </div>
    </div>
  );
};

export default ChatPage;
