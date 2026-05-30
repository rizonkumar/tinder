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
  Camera,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallStore } from "../../store/useCallStore";
import LoadingState from "../../components/common/LoadingState";
import FallbackState from "../../components/common/FallbackState";
import confetti from "canvas-confetti";

const fallbackGifs = [
  { id: "1", title: "Love Bear", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3N2c2t3N3UycDNwdDJ2N29oOTl0Mnl5aTRjcmhrdDQ2ZnE0MGY0NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/du3J3cXyzhj75IOgvA/giphy.gif" },
  { id: "2", title: "Cute Wave", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpqZDR5OHg2aDZndHFpMXZ2cXR0NDl4cnZ5cjI1M2R4M294MXpxNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/VuoqO5g159T93G140C/giphy.gif" },
  { id: "3", title: "Cat Hug", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmVwdThnaDB6cG51NWxnaGR5OHoycGJ5aG05OXN2bDVpYTQ2NXJ0ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/CKe3B7Bvx1sS4/giphy.gif" },
  { id: "4", title: "Wink Dog", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJydHJid3N2czBpc3hrY2VyeDRkYWtucnpsMGNod2F6bnF1ZjZpbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/13CoXDiaCcC2EA/giphy.gif" },
  { id: "5", title: "Excited Dance", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTZoZnQycXZ2OHY3cjQ0OXh2cjE5eWNjajZ6ZnpxOGdndXRtcHhqZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/blSTtZehjAZ8I/giphy.gif" },
  { id: "6", title: "Heart Pop", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWp3ZnRnbXpxNm9nd2Jyd2NtdHA2cXR2ZzJ5djE5MTRxMXAxdGpxZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l41JWd1xzcx437nmw/giphy.gif" }
];

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
    respondToDateProposal,
    getSmartReplies,
    smartReplies,
    isLoadingSmartReplies,
  } = useMessageStore();

  const [text, setText] = useState("");
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isCurrentlyTypingEmit, setIsCurrentlyTypingEmit] = useState(false);

  // Date Planner States
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("Coffee");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  // GIPHY & Rich Media States
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifQuery, setGifQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);

  // AI Smart Replies States
  const [showSmartReplies, setShowSmartReplies] = useState(false);

  // GIPHY API Search Hook
  useEffect(() => {
    if (!showGifPicker) return;
    
    const fetchGifs = async () => {
      setIsLoadingGifs(true);
      try {
        const query = gifQuery.trim() || "love";
        const res = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodeURIComponent(query)}&limit=12`
        );
        const data = await res.json();
        if (data && data.data && data.data.length > 0) {
          const formatted = data.data.map(item => ({
            id: item.id,
            title: item.title,
            url: item.images.fixed_height.url
          }));
          setGifs(formatted);
        } else {
          setGifs(fallbackGifs);
        }
      } catch (err) {
        console.warn("GIPHY API key or fetch failed, fallback to presets:", err);
        setGifs(fallbackGifs);
      } finally {
        setIsLoadingGifs(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchGifs();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [gifQuery, showGifPicker]);

  // Image Upload base64 -> Cloudinary Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max size is 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      await sendMessage("", "image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Date Proposal Submission Handler
  const handleSendDateProposal = async (e) => {
    e.preventDefault();
    if (!dateInput || !timeInput || !locationInput) {
      alert("Please fill in all date details");
      return;
    }

    const proposal = {
      date: dateInput,
      time: timeInput,
      location: locationInput.trim(),
      activity: selectedActivity,
      status: "pending",
    };

    await sendMessage(
      `Proposed a date: ${selectedActivity} 📅`,
      "date_proposal",
      "",
      proposal
    );

    // Reset date fields and modal
    setDateInput("");
    setTimeInput("");
    setLocationInput("");
    setIsDateModalOpen(false);
  };

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
    setIsProfileModalOpen(false);
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
              <div className="flex items-center space-x-3 flex-grow overflow-hidden">
                <Link
                  to="/chat"
                  className="text-slate-400 hover:text-pink-500 lg:hidden transition-colors shrink-0"
                >
                  <ArrowLeft size={22} />
                </Link>
                
                <div 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center space-x-3 cursor-pointer select-none group flex-grow overflow-hidden"
                >
                  <div className="relative shrink-0">
                    <img
                      src={activeChatUser.image || "/avatar.png"}
                      alt={activeChatUser.name}
                      className="h-11 w-11 rounded-full border border-slate-200/50 dark:border-zinc-800 object-cover shadow-sm transition-transform duration-300 group-hover:scale-103"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                        isOnline ? "bg-green-500" : "bg-slate-300 dark:bg-zinc-700"
                      }`}
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="text-base font-bold text-slate-800 dark:text-zinc-200 leading-tight font-outfit group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors truncate">
                      {activeChatUser.name}
                    </h2>
                    <div className="text-[11px] mt-0.5 font-medium truncate">
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

                  if (message.messageType === "date_proposal") {
                    const info = message.dateInfo || {};
                    const activityGradients = {
                      Coffee: { bg: "from-amber-400 to-orange-500", icon: "☕", label: "Coffee Date" },
                      Dinner: { bg: "from-rose-400 to-pink-600", icon: "🍽️", label: "Dinner Date" },
                      Drinks: { bg: "from-indigo-500 to-purple-600", icon: "🍸", label: "Drinks Date" },
                      Movie: { bg: "from-cyan-400 to-blue-600", icon: "🎬", label: "Movie Night" },
                      Walk: { bg: "from-emerald-400 to-teal-600", icon: "🌳", label: "Walk / Park" },
                    };
                    const act = activityGradients[info.activity] || { bg: "from-pink-400 to-rose-500", icon: "📅", label: "Plan" };

                    const handleRespond = (status) => {
                      respondToDateProposal(message._id, status);
                      if (status === "accepted") {
                        confetti({
                          particleCount: 150,
                          spread: 80,
                          origin: { y: 0.6 }
                        });
                      }
                    };

                    const isPending = info.status === "pending";
                    const isAccepted = info.status === "accepted";
                    const isDeclined = info.status === "declined";

                    return (
                      <div
                        key={message._id}
                        className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-4`}
                      >
                        <div
                          className={`w-full max-w-[300px] rounded-3xl p-5 shadow-md border backdrop-blur-xl relative overflow-hidden transition-all duration-300 ${
                            isAccepted
                              ? "bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/80 shadow-pink-500/10 scale-[1.02]"
                              : isDeclined
                              ? "bg-slate-100/40 dark:bg-zinc-900/40 border-slate-200/40 dark:border-zinc-800/40 opacity-60"
                              : "bg-white dark:bg-zinc-900 border-slate-200/60 dark:border-zinc-800/80 shadow-sm"
                          }`}
                        >
                          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${act.bg}`} />
                          
                          <div className="flex items-center justify-between mb-4 mt-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                              Date Proposal
                            </span>
                            {isAccepted && (
                              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-500">
                                Confirmed 💖
                              </span>
                            )}
                            {isDeclined && (
                              <span className="rounded-full bg-slate-500/10 border border-slate-500/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                Declined
                              </span>
                            )}
                            {isPending && (
                              <span className="rounded-full bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-pink-500 animate-pulse">
                                Pending
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${act.bg} text-xl shadow-sm transform -rotate-2 shrink-0`}>
                              {act.icon}
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 font-outfit truncate">
                                {act.label}
                              </h4>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                                Suggested by {isSentByMe ? "You" : activeChatUser.name}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 text-[11px] text-slate-600 dark:text-zinc-300 font-medium font-sans mb-4 border-t border-b border-slate-100 dark:border-zinc-800/80 py-2.5">
                            <div className="flex items-center space-x-2">
                              <Calendar size={12} className="text-pink-500/80 shrink-0" />
                              <span className="truncate">{info.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock size={12} className="text-pink-500/80 shrink-0" />
                              <span>{info.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin size={12} className="text-pink-500/80 shrink-0" />
                              <span className="truncate">{info.location || "To be decided"}</span>
                            </div>
                          </div>

                          {isPending && (
                            <div className="w-full mt-2">
                              {isSentByMe ? (
                                <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 italic py-1 font-outfit font-semibold">
                                  Waiting for reply...
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 w-full">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleRespond("declined")}
                                    className="flex-1 py-1.5 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-red-500 transition-all font-outfit focus:outline-none"
                                  >
                                    Decline
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleRespond("accepted")}
                                    className="flex-1 py-1.5 text-center text-[10px] font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl hover:shadow-md hover:shadow-pink-500/10 hover:from-pink-600 hover:to-rose-600 transition-all font-outfit focus:outline-none"
                                  >
                                    Accept 💖
                                  </motion.button>
                                </div>
                              )}
                            </div>
                          )}

                          <span className="block text-[8px] mt-2.5 text-right font-medium text-slate-400 dark:text-slate-550 font-sans">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  if (message.messageType === "image") {
                    return (
                      <div
                        key={message._id}
                        className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-2`}
                      >
                        <div
                          className={`max-w-[65%] rounded-2xl overflow-hidden shadow-sm border border-slate-200/30 dark:border-zinc-800/50 ${
                            isSentByMe
                              ? "bg-pink-500 p-1 rounded-tr-none"
                              : "bg-white dark:bg-zinc-900 p-1 rounded-tl-none"
                          }`}
                        >
                          <img
                            src={message.mediaUrl}
                            alt="Shared media"
                            className="max-h-64 w-full object-cover rounded-xl select-none"
                            loading="lazy"
                          />
                          <span
                            className={`block text-[9px] mt-1 pr-1 text-right font-medium font-sans ${
                              isSentByMe ? "text-pink-100" : "text-slate-400 dark:text-slate-500"
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
              className="border-t border-slate-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shrink-0 relative flex flex-col z-10 select-none"
            >
              <AnimatePresence>
                {/* AI Smart Replies Suggestions Bar */}
                {showSmartReplies && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-slate-200/50 dark:border-zinc-800 p-3 bg-pink-50/20 dark:bg-zinc-900/60 space-y-2 rounded-t-2xl overflow-hidden shrink-0"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider font-outfit shrink-0">
                      <span className="whitespace-nowrap flex items-center gap-1">
                        AI Wingman Suggestions ✨
                      </span>
                      <button
                        type="button"
                        onClick={() => getSmartReplies(id)}
                        className="text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 font-bold transition-colors duration-200 focus:outline-none select-none shrink-0"
                      >
                        Regenerate
                      </button>
                    </div>
                    {isLoadingSmartReplies ? (
                      <div className="flex py-2 justify-center">
                        <LoadingState message="" type="inline" />
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-1.5 max-h-36 overflow-y-auto overflow-x-hidden scrollbar-none">
                        {smartReplies.map((reply, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setText(reply);
                              setShowSmartReplies(false);
                            }}
                            className="w-full text-left bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-pink-500/30 dark:hover:border-pink-500/30 transition-all font-medium leading-relaxed shadow-sm font-sans"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* GIPHY GIF Picker Popover */}
                {showGifPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-20 left-4 right-4 z-50 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl p-4 flex flex-col h-[280px]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 font-outfit uppercase tracking-wider">
                        Search GIPHY GIFs 🎬
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowGifPicker(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 focus:outline-none"
                      >
                        Close
                      </button>
                    </div>

                    <input
                      type="text"
                      value={gifQuery}
                      onChange={(e) => setGifQuery(e.target.value)}
                      placeholder="Type keyword e.g. wink, wave, cat..."
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2 outline-none mb-3 focus:border-pink-500 text-slate-800 dark:text-zinc-100"
                    />

                    <div className="flex-grow overflow-y-auto grid grid-cols-3 gap-2 pr-0.5 scrollbar-none">
                      {isLoadingGifs ? (
                        <div className="col-span-3 flex items-center justify-center h-full">
                          <LoadingState message="" type="inline" />
                        </div>
                      ) : gifs.length === 0 ? (
                        <div className="col-span-3 text-center text-xs text-slate-400 italic py-8">
                          No GIFs found.
                        </div>
                      ) : (
                        gifs.map((g) => (
                          <div
                            key={g.id}
                            onClick={() => {
                              sendMessage("Sent a GIF 🎬", "image", g.url);
                              setShowGifPicker(false);
                            }}
                            className="aspect-square rounded-lg overflow-hidden cursor-pointer border border-slate-100 dark:border-zinc-800/80 hover:border-pink-500 hover:scale-[1.02] active:scale-[0.98] transition-all bg-slate-50 dark:bg-zinc-955 shrink-0"
                          >
                            <img
                              src={g.url}
                              alt={g.title}
                              className="h-full w-full object-cover select-none"
                              loading="lazy"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

                {showIcebreakers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-slate-200/50 dark:border-zinc-800 p-3 bg-slate-50 dark:bg-zinc-900/80 space-y-2 rounded-t-2xl overflow-hidden shrink-0"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider font-outfit shrink-0">
                      <span className="whitespace-nowrap">AI Icebreakers ✨</span>
                      <button
                        type="button"
                        onClick={() => getIcebreakers(id)}
                        className="text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 font-bold transition-colors duration-200 focus:outline-none select-none shrink-0 whitespace-nowrap"
                      >
                        Regenerate
                      </button>
                    </div>
                    {isLoadingIcebreakers ? (
                      <div className="flex py-2 justify-center">
                        <LoadingState message="" type="inline" />
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-1.5 max-h-36 overflow-y-auto overflow-x-hidden scrollbar-none">
                        {icebreakers.map((starter, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setText(starter);
                              setShowIcebreakers(false);
                            }}
                            className="w-full text-left bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-pink-500/30 dark:hover:border-pink-500/30 transition-all font-medium leading-relaxed shadow-sm font-sans whitespace-normal break-words"
                          >
                            {starter}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center space-x-2.5 p-4 shrink-0">
                {/* Photo Upload Picker */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="chat-photo-input"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => document.getElementById("chat-photo-input").click()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 text-slate-505 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors focus:outline-none shrink-0"
                  title="Share Photo"
                >
                  <Camera size={17} />
                </motion.button>

                {/* GIPHY Picker trigger */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setShowGifPicker(!showGifPicker);
                    setShowIcebreakers(false);
                    setShowSmartReplies(false);
                  }}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus:outline-none shrink-0 ${
                    showGifPicker
                      ? "bg-pink-500 border-pink-500 text-white"
                      : "bg-slate-50 dark:bg-zinc-900 border-slate-200/50 dark:border-zinc-800 text-slate-505 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400"
                  }`}
                  title="Share GIF"
                >
                  <ImageIcon size={17} />
                </motion.button>

                {/* Date Planner Modal trigger */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsDateModalOpen(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 text-slate-505 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors focus:outline-none shrink-0"
                  title="Plan a Date"
                >
                  <Calendar size={17} />
                </motion.button>

                {/* Smart Replies trigger */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setShowSmartReplies(!showSmartReplies);
                    setShowIcebreakers(false);
                    setShowGifPicker(false);
                    if (!showSmartReplies) {
                      getSmartReplies(id);
                    }
                  }}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus:outline-none shrink-0 ${
                    showSmartReplies
                      ? "bg-pink-500 border-pink-500 text-white"
                      : "bg-slate-50 dark:bg-zinc-900 border-slate-200/50 dark:border-zinc-800 text-slate-505 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400"
                  }`}
                  title="AI Wingman"
                >
                  <Sparkles size={17} />
                </motion.button>

                {/* Icebreakers trigger */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setShowIcebreakers(!showIcebreakers);
                    setShowSmartReplies(false);
                    setShowGifPicker(false);
                  }}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus:outline-none shrink-0 ${
                    showIcebreakers
                      ? "bg-pink-500 border-pink-500 text-white"
                      : "bg-slate-50 dark:bg-zinc-900 border-slate-200/50 dark:border-zinc-800 text-slate-505 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400"
                  }`}
                  title="AI Icebreakers"
                >
                  <MessageCircle size={17} />
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
                              isOnline ? "bg-green-500" : "bg-slate-350 dark:bg-zinc-700"
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

      <AnimatePresence>
        {isProfileModalOpen && activeChatUser && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 shadow-2xl flex flex-col sm:flex-row font-sans text-slate-800 dark:text-zinc-100 max-h-[90vh] sm:h-[450px]"
            >
              <div className="w-full sm:w-[220px] bg-slate-50 dark:bg-zinc-950 border-b sm:border-b-0 sm:border-r border-slate-200/50 dark:border-zinc-800/80 p-5 flex flex-col shrink-0">
                <h3 className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 font-outfit mb-4">
                  Contact
                </h3>
                <div className="space-y-1">
                  <button className="w-full text-left bg-pink-500/10 text-pink-600 dark:text-pink-400 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none select-none font-outfit">
                    Info
                  </button>
                  <button className="w-full text-left text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none select-none font-outfit">
                    Media, links and docs
                  </button>
                  <button className="w-full text-left text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none select-none font-outfit">
                    Encryption
                  </button>
                </div>
              </div>

              <div className="flex-grow p-6 flex flex-col justify-between overflow-hidden">
                <div className="overflow-y-auto pr-1 space-y-5 flex-grow scrollbar-none">
                  <div className="flex flex-col items-center text-center space-y-3 shrink-0">
                    <div className="relative">
                      <img
                        src={activeChatUser.image || "/avatar.png"}
                        alt={activeChatUser.name}
                        className="h-20 w-20 rounded-full border-2 border-pink-500 dark:border-pink-400 object-cover shadow-sm"
                      />
                      <span
                        className={`absolute bottom-0 right-0 h-4.5 w-4.5 rounded-full border-4 border-white dark:border-zinc-900 ${
                          isOnline ? "bg-green-500" : "bg-slate-300 dark:bg-zinc-700"
                        }`}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200 leading-tight font-outfit">
                        {activeChatUser.name}, <span className="font-semibold">{activeChatUser.age}</span>
                      </h2>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium font-sans">
                        {isOnline ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-outfit">
                        About
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-300 font-medium font-sans">
                        {activeChatUser.bio || "No bio available."}
                      </p>
                    </div>

                    {activeChatUser.interests && activeChatUser.interests.length > 0 && (
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-outfit">
                          Interests / Hobbies
                        </h4>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-none">
                          {activeChatUser.interests.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-pink-50 dark:bg-pink-950/20 border border-pink-100/40 dark:border-pink-900/30 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 shrink-0 font-outfit"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 dark:border-zinc-800/80 pt-4 flex items-center justify-between shrink-0">
                  {isOnline ? (
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsProfileModalOpen(false);
                          initiateCall(activeChatUser._id, "voice");
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
                      >
                        <Phone size={15} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsProfileModalOpen(false);
                          initiateCall(activeChatUser._id, "video");
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
                      >
                        <Video size={15} />
                      </motion.button>
                    </div>
                  ) : (
                    <div />
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsProfileModalOpen(false)}
                    className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-xs font-bold shadow-sm focus:outline-none font-outfit"
                  >
                    Done
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isDateModalOpen && activeChatUser && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 shadow-2xl p-6 font-sans text-slate-800 dark:text-zinc-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-zinc-100 font-outfit">
                  Plan a Social Date 📅
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDateModalOpen(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
              
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-5 font-sans leading-relaxed">
                Choose a cute activity, pick a date and time, and suggest a nice venue to meet {activeChatUser.name}!
              </p>

              <form onSubmit={handleSendDateProposal} className="space-y-5">
                {/* Activity Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                    Choose Activity
                  </label>
                  <div className="flex flex-wrap gap-2 select-none">
                    {[
                      { name: "Coffee", icon: "☕", gradient: "from-amber-400 to-orange-500" },
                      { name: "Dinner", icon: "🍽️", gradient: "from-rose-400 to-pink-600" },
                      { name: "Drinks", icon: "🍸", gradient: "from-indigo-500 to-purple-600" },
                      { name: "Movie", icon: "🎬", gradient: "from-cyan-400 to-blue-600" },
                      { name: "Walk", icon: "🌳", gradient: "from-emerald-400 to-teal-600" },
                    ].map((act) => {
                      const isSelected = selectedActivity === act.name;
                      return (
                        <button
                          key={act.name}
                          type="button"
                          onClick={() => setSelectedActivity(act.name)}
                          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-outfit border transition-all ${
                            isSelected
                              ? `bg-gradient-to-r ${act.gradient} text-white border-transparent scale-103 shadow-md`
                              : "bg-slate-50 dark:bg-zinc-950 border-slate-200/60 dark:border-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
                          }`}
                        >
                          <span>{act.icon}</span>
                          <span>{act.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date & Time Picker */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                      Date
                    </label>
                    <input
                      type="date"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                      required
                      className="w-full text-xs rounded-xl border border-slate-200/60 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 px-3.5 py-2.5 outline-none focus:border-pink-500 text-slate-800 dark:text-zinc-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                      Time
                    </label>
                    <input
                      type="time"
                      value={timeInput}
                      onChange={(e) => setTimeInput(e.target.value)}
                      required
                      className="w-full text-xs rounded-xl border border-slate-200/60 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 px-3.5 py-2.5 outline-none focus:border-pink-500 text-slate-800 dark:text-zinc-100"
                    />
                  </div>
                </div>

                {/* Location Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                    Suggested Venue / Location
                  </label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500/80 pointer-events-none" />
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      required
                      placeholder="e.g. Starbucks Main St, Central Park..."
                      className="w-full text-xs rounded-xl border border-slate-200/60 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 pl-9.5 pr-4 py-2.5 outline-none focus:border-pink-500 text-slate-800 dark:text-zinc-100"
                    />
                  </div>
                </div>

                {/* Submit Proposal Button */}
                <div className="pt-2 flex items-center space-x-3 w-full">
                  <button
                    type="button"
                    onClick={() => setIsDateModalOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all font-outfit focus:outline-none"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl hover:shadow-lg hover:shadow-pink-500/10 hover:from-pink-600 hover:to-rose-600 transition-all font-outfit focus:outline-none"
                  >
                    Send Proposal 📅
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
