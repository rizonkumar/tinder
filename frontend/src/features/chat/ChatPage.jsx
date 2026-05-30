import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fallbackGifs,
  ACTIVITY_OPTIONS,
  DEFAULT_ACTIVITY,
  EMOJI_REACTIONS,
} from "../../constants";
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
  Calendar,
  MapPin,
  Clock,
  Paperclip,
  Smile,
  X,
  Check,
  Search,
  Shield,
  Lock,
  Image,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallStore } from "../../store/useCallStore";
import LoadingState from "../../components/common/LoadingState";
import FallbackState from "../../components/common/FallbackState";
import CustomDatePicker from "../../components/common/CustomDatePicker";
import CustomTimePicker from "../../components/common/CustomTimePicker";
import confetti from "canvas-confetti";

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
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiTab, setAiTab] = useState("replies"); // "replies" | "icebreakers"
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("info"); // "info" | "media" | "encryption"
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);
  const [isEncryptionVerified, setIsEncryptionVerified] = useState(false);

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatches, setSearchMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [activeHighlightedMessageId, setActiveHighlightedMessageId] =
    useState(null);
  const [activeReactionPickerMessageId, setActiveReactionPickerMessageId] =
    useState(null);

  const [reactions, setReactions] = useState({});

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(`reactions-${id}`);
      setReactions(saved ? JSON.parse(saved) : {});
      const verifiedSaved = localStorage.getItem("verified-chats");
      const verifiedMap = verifiedSaved ? JSON.parse(verifiedSaved) : {};
      setIsEncryptionVerified(!!verifiedMap[id]);
      setModalTab("info");
      setShowSearchBar(false);
      setSearchQuery("");
      setSearchMatches([]);
      setCurrentMatchIndex(-1);
      setActiveHighlightedMessageId(null);
      setActiveReactionPickerMessageId(null);
    }
  }, [id]);

  useEffect(() => {
    if (id && Object.keys(reactions).length > 0) {
      localStorage.setItem(`reactions-${id}`, JSON.stringify(reactions));
    }
  }, [reactions, id]);

  const addReaction = (messageId, emoji) => {
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
  };

  const getVerificationFingerprint = (id1, id2) => {
    if (!id1 || !id2) return "00000 00000 00000 00000 00000 00000";
    const combined = [id1, id2].sort().join("");
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    const parts = [];
    for (let j = 0; j < 5; j++) {
      const seed = Math.abs(Math.sin(hash + j) * 100000);
      const code = Math.floor(seed % 100000)
        .toString()
        .padStart(5, "0");
      parts.push(code);
    }
    return parts.join(" ");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchMatches([]);
      setCurrentMatchIndex(-1);
      setActiveHighlightedMessageId(null);
      return;
    }

    const matchesList = messages.filter(
      (m) =>
        m.messageType === "text" &&
        m.content.toLowerCase().includes(query.toLowerCase()),
    );

    setSearchMatches(matchesList);
    if (matchesList.length > 0) {
      setCurrentMatchIndex(0);
      scrollToAndHighlight(matchesList[0]._id);
    } else {
      setCurrentMatchIndex(-1);
      setActiveHighlightedMessageId(null);
    }
  };

  const scrollToAndHighlight = (messageId) => {
    setActiveHighlightedMessageId(messageId);
    setTimeout(() => {
      const el = document.getElementById(`msg-${messageId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);

    setTimeout(() => {
      setActiveHighlightedMessageId((prev) =>
        prev === messageId ? null : prev,
      );
    }, 2000);
  };

  const nextSearchMatch = () => {
    if (searchMatches.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIdx);
    scrollToAndHighlight(searchMatches[nextIdx]._id);
  };

  const prevSearchMatch = () => {
    if (searchMatches.length === 0) return;
    const prevIdx =
      (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    setCurrentMatchIndex(prevIdx);
    scrollToAndHighlight(searchMatches[prevIdx]._id);
  };

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isCurrentlyTypingEmit, setIsCurrentlyTypingEmit] = useState(false);

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("Coffee");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifQuery, setGifQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);

  useEffect(() => {
    if (!showGifPicker) return;

    const fetchGifs = async () => {
      setIsLoadingGifs(true);
      try {
        const query = gifQuery.trim() || "love";
        const res = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodeURIComponent(query)}&limit=12`,
        );
        const data = await res.json();
        if (data && data.data && data.data.length > 0) {
          const formatted = data.data.map((item) => ({
            id: item.id,
            title: item.title,
            url: item.images.fixed_height.url,
          }));
          setGifs(formatted);
        } else {
          setGifs(fallbackGifs);
        }
      } catch (err) {
        console.warn(
          "GIPHY API key or fetch failed, fallback to presets:",
          err,
        );
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Max size is 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      await sendMessage("", "image", reader.result);
    };
    reader.readAsDataURL(file);
  };

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
      `Proposed a date: ${selectedActivity}`,
      "date_proposal",
      "",
      proposal,
    );

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
                        isOnline
                          ? "bg-green-500"
                          : "bg-slate-300 dark:bg-zinc-700"
                      }`}
                    />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center space-x-1.5 overflow-hidden">
                      <h2 className="text-base font-bold text-slate-800 dark:text-zinc-200 leading-tight font-outfit group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors truncate">
                        {activeChatUser.name}
                      </h2>
                      {isEncryptionVerified && (
                        <span className="text-emerald-500 shrink-0 select-none animate-pulse" title="E2E Encryption Verified">
                          <ShieldCheck size={14} className="fill-emerald-500/10 stroke-[2.2]" />
                        </span>
                      )}
                    </div>
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

              <div className="flex items-center space-x-2 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowSearchBar(!showSearchBar);
                    if (showSearchBar) {
                      setSearchQuery("");
                      setSearchMatches([]);
                      setCurrentMatchIndex(-1);
                      setActiveHighlightedMessageId(null);
                    }
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all focus:outline-none ${
                    showSearchBar
                      ? "bg-pink-500 border-pink-500 text-white shadow-sm shadow-pink-500/20"
                      : "border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  }`}
                  title="Search Messages"
                >
                  <Search size={15} />
                </motion.button>

                {isOnline && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => initiateCall(activeChatUser._id, "voice")}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
                      title="Voice Call"
                    >
                      <Phone size={15} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => initiateCall(activeChatUser._id, "video")}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
                      title="Video Call"
                    >
                      <Video size={15} />
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            <AnimatePresence>
              {showSearchBar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center space-x-3 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200/40 dark:border-zinc-800/80 px-4 py-2.5 shrink-0 select-none"
                >
                  <div className="relative flex-grow">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search conversation..."
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-9 pr-8 py-2 outline-none focus:border-pink-500 text-slate-800 dark:text-zinc-100"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => handleSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {searchMatches.length > 0 && (
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 dark:text-zinc-400 shrink-0 font-outfit uppercase tracking-wider">
                      <span>
                        {currentMatchIndex + 1} of {searchMatches.length}
                      </span>
                      <button
                        type="button"
                        onClick={prevSearchMatch}
                        className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors uppercase tracking-widest text-[9px]"
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        onClick={nextSearchMatch}
                        className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors uppercase tracking-widest text-[9px]"
                      >
                        Next
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowSearchBar(false);
                      setSearchQuery("");
                      setSearchMatches([]);
                      setCurrentMatchIndex(-1);
                      setActiveHighlightedMessageId(null);
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-655 dark:hover:text-zinc-300 focus:outline-none shrink-0"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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
                    const act =
                      ACTIVITY_OPTIONS[info.activity] || DEFAULT_ACTIVITY;
                    const IconComponent = act.icon || Calendar;
                    const isHighlighted =
                      message._id === activeHighlightedMessageId;

                    const handleRespond = (status) => {
                      respondToDateProposal(message._id, status);
                      if (status === "accepted") {
                        confetti({
                          particleCount: 150,
                          spread: 80,
                          origin: { y: 0.6 },
                        });
                      }
                    };

                    const isPending = info.status === "pending";
                    const isAccepted = info.status === "accepted";
                    const isDeclined = info.status === "declined";

                    return (
                      <div
                        key={message._id}
                        id={`msg-${message._id}`}
                        className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-4 transition-all duration-300 ${
                          isHighlighted ? "scale-[1.02]" : ""
                        }`}
                      >
                        <div
                          className={`w-full max-w-[310px] rounded-2xl p-5 shadow-sm border relative overflow-hidden transition-all duration-200 ${
                            isAccepted
                              ? "bg-white dark:bg-zinc-900 border-emerald-200 dark:border-emerald-800/40"
                              : isDeclined
                                ? "bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 opacity-50"
                                : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
                          } ${
                            isHighlighted
                              ? "ring-4 ring-pink-500/40 shadow-lg shadow-pink-500/30"
                              : ""
                          }`}
                        >
                          <div
                            className={`absolute top-0 left-0 right-0 h-[3px] ${
                              isAccepted
                                ? "bg-emerald-500"
                                : isDeclined
                                  ? "bg-slate-300 dark:bg-zinc-700"
                                  : "bg-pink-500"
                            }`}
                          />

                          <div className="flex items-center justify-between mb-4 mt-0.5 select-none">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-outfit">
                              Date Proposal
                            </span>
                            {isAccepted && (
                              <span className="flex items-center space-x-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span>Confirmed</span>
                              </span>
                            )}
                            {isDeclined && (
                              <span className="flex items-center space-x-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-zinc-600" />
                                <span>Declined</span>
                              </span>
                            )}
                            {isPending && (
                              <span className="flex items-center space-x-1.5 rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                <span>Pending</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-3.5 mb-4">
                            <div
                              className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${
                                isAccepted
                                  ? "bg-emerald-500"
                                  : isDeclined
                                    ? "bg-slate-300 dark:bg-zinc-700"
                                    : "bg-pink-500"
                              } text-white shrink-0`}
                            >
                              <IconComponent
                                size={20}
                                className="stroke-[2.2]"
                              />
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="text-sm font-extrabold text-slate-800 dark:text-zinc-100 font-outfit tracking-tight leading-none mb-1.5">
                                {act.label}
                              </h4>
                              <p className="text-[9px] text-slate-400 dark:text-zinc-500 truncate font-bold font-outfit uppercase tracking-wider">
                                Suggested by{" "}
                                {isSentByMe ? "You" : activeChatUser.name}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-300 font-medium font-sans mb-4 border-t border-b border-slate-100 dark:border-zinc-800 py-3 mt-1 select-none">
                            <div className="flex items-center space-x-2.5">
                              <Calendar
                                size={13}
                                className="text-slate-400 dark:text-zinc-500 shrink-0"
                              />
                              <span className="truncate">{info.date}</span>
                            </div>
                            <div className="flex items-center space-x-2.5">
                              <Clock
                                size={13}
                                className="text-slate-400 dark:text-zinc-500 shrink-0"
                              />
                              <span className="truncate">{info.time}</span>
                            </div>
                            <div className="flex items-center space-x-2.5">
                              <MapPin
                                size={13}
                                className="text-slate-400 dark:text-zinc-500 shrink-0"
                              />
                              <span className="truncate font-semibold">
                                {info.location || "To be decided"}
                              </span>
                            </div>
                          </div>

                          {isPending && (
                            <div className="w-full mt-2">
                              {isSentByMe ? (
                                <div className="flex items-center justify-center space-x-2 text-center text-[10px] text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-800/50 rounded-xl py-2.5 font-outfit font-semibold tracking-wide">
                                  <Clock size={12} />
                                  <span>
                                    Awaiting {activeChatUser.name}'s reply
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2.5 w-full">
                                  <button
                                    onClick={() => handleRespond("declined")}
                                    className="flex-1 py-2 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-700 transition-colors font-outfit focus:outline-none flex items-center justify-center space-x-1.5 uppercase tracking-wider"
                                  >
                                    <X size={12} />
                                    <span>Decline</span>
                                  </button>
                                  <button
                                    onClick={() => handleRespond("accepted")}
                                    className="flex-1 py-2 rounded-xl text-[10px] font-bold text-white bg-pink-500 hover:bg-pink-600 active:bg-pink-700 transition-colors font-outfit focus:outline-none flex items-center justify-center space-x-1.5 uppercase tracking-wider"
                                  >
                                    <Heart size={12} className="fill-white" />
                                    <span>Accept</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          <span className="block text-[8px] mt-2.5 text-right font-medium text-slate-400 dark:text-slate-550 font-sans">
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

                  if (message.messageType === "image") {
                    const isHighlighted =
                      message._id === activeHighlightedMessageId;
                    const messageReaction = reactions[message._id];

                    return (
                      <div
                        key={message._id}
                        id={`msg-${message._id}`}
                        className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-2.5 relative group items-center`}
                      >
                        {!isSentByMe && (
                          <div className="order-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 select-none shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveReactionPickerMessageId(
                                  activeReactionPickerMessageId === message._id
                                    ? null
                                    : message._id,
                                )
                              }
                              className="p-1 text-slate-400 hover:text-pink-500 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-all focus:outline-none"
                              title="React to photo"
                            >
                              <Smile size={14} />
                            </button>
                          </div>
                        )}

                        <div
                          className={`max-w-[65%] rounded-2xl overflow-hidden shadow-sm border relative transition-all duration-300 ${
                            isSentByMe
                              ? "bg-pink-500 p-1 rounded-tr-none order-1"
                              : "bg-white dark:bg-zinc-900 p-1 rounded-tl-none order-1 border-slate-200/30 dark:border-zinc-800/50"
                          } ${
                            isHighlighted
                              ? "ring-4 ring-pink-500/40 shadow-lg shadow-pink-500/30 scale-[1.02]"
                              : ""
                          }`}
                        >
                          <img
                            src={message.mediaUrl}
                            alt="Shared media"
                            className="max-h-64 w-full object-cover rounded-xl select-none cursor-pointer hover:opacity-95 transition-opacity"
                            loading="lazy"
                            onClick={() =>
                              setActiveLightboxImage(message.mediaUrl)
                            }
                          />
                          <span
                            className={`block text-[9px] mt-1 pr-1 text-right font-medium font-sans ${
                              isSentByMe
                                ? "text-pink-100"
                                : "text-slate-400 dark:text-slate-500"
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>

                          {/* Message Reaction Pill */}
                          {messageReaction && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              onClick={() => addReaction(message._id, null)}
                              className={`absolute -bottom-1.5 ${
                                isSentByMe ? "left-3" : "right-3"
                              } bg-white dark:bg-zinc-800 border border-slate-150 dark:border-zinc-700/60 rounded-full px-1.5 py-0.5 shadow-sm text-[11px] leading-none flex items-center select-none cursor-pointer border-pink-100 dark:border-pink-900/20 hover:scale-110 active:scale-95 transition-all`}
                              title="Click to remove reaction"
                            >
                              {messageReaction}
                            </motion.div>
                          )}

                          {/* Floating Reaction Picker */}
                          <AnimatePresence>
                            {activeReactionPickerMessageId === message._id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className={`absolute -top-11 ${
                                  isSentByMe ? "right-0" : "left-0"
                                } z-30 flex items-center space-x-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-lg border border-slate-200/60 dark:border-zinc-800 select-none`}
                              >
                                {EMOJI_REACTIONS.map((emoji) => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => {
                                      addReaction(message._id, emoji);
                                      setActiveReactionPickerMessageId(null);
                                    }}
                                    className="hover:scale-130 active:scale-95 transition-transform duration-200 text-sm leading-none"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {isSentByMe && (
                          <div className="order-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2 select-none shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveReactionPickerMessageId(
                                  activeReactionPickerMessageId === message._id
                                    ? null
                                    : message._id,
                                )
                              }
                              className="p-1 text-slate-400 hover:text-pink-500 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-all focus:outline-none"
                              title="React to photo"
                            >
                              <Smile size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  const isHighlighted =
                    message._id === activeHighlightedMessageId;
                  const messageReaction = reactions[message._id];

                  return (
                    <div
                      key={message._id}
                      id={`msg-${message._id}`}
                      className={`flex w-full ${isSentByMe ? "justify-end" : "justify-start"} my-2 relative group items-center`}
                    >
                      {!isSentByMe && (
                        <div className="order-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 select-none shrink-0 flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveReactionPickerMessageId(
                                activeReactionPickerMessageId === message._id
                                  ? null
                                  : message._id,
                              )
                            }
                            className="p-1 text-slate-400 hover:text-pink-500 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-all focus:outline-none"
                            title="React to message"
                          >
                            <Smile size={14} />
                          </button>
                        </div>
                      )}

                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed font-sans relative transition-all duration-305 ${
                          isSentByMe
                            ? "bg-pink-500 text-white rounded-tr-none order-1"
                            : "bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200/45 dark:border-zinc-800/80 rounded-tl-none font-medium order-1"
                        } ${
                          isHighlighted
                            ? "ring-4 ring-pink-500/40 shadow-lg shadow-pink-500/30 scale-[1.02] bg-pink-100 dark:bg-pink-950/20"
                            : ""
                        }`}
                      >
                        <p>{message.content}</p>
                        <span
                          className={`block text-[9px] mt-1.5 text-right font-medium font-sans ${
                            isSentByMe
                              ? "text-pink-100"
                              : "text-slate-400 dark:text-slate-550"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {messageReaction && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            onClick={() => addReaction(message._id, null)}
                            className={`absolute -bottom-2.5 ${
                              isSentByMe ? "left-3" : "right-3"
                            } bg-white dark:bg-zinc-800 border border-slate-150 dark:border-zinc-700/60 rounded-full px-1.5 py-0.5 shadow-sm text-[11px] leading-none flex items-center select-none cursor-pointer border-pink-100 dark:border-pink-900/20 hover:scale-110 active:scale-95 transition-all`}
                            title="Click to remove reaction"
                          >
                            {messageReaction}
                          </motion.div>
                        )}

                        <AnimatePresence>
                          {activeReactionPickerMessageId === message._id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              className={`absolute -top-11 ${
                                isSentByMe ? "right-0" : "left-0"
                              } z-30 flex items-center space-x-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-lg border border-slate-200/60 dark:border-zinc-800 select-none`}
                            >
                              {EMOJI_REACTIONS.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    addReaction(message._id, emoji);
                                    setActiveReactionPickerMessageId(null);
                                  }}
                                  className="hover:scale-130 active:scale-95 transition-transform duration-200 text-sm leading-none"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {isSentByMe && (
                        <div className="order-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2 select-none shrink-0 flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveReactionPickerMessageId(
                                activeReactionPickerMessageId === message._id
                                  ? null
                                  : message._id,
                              )
                            }
                            className="p-1 text-slate-400 hover:text-pink-500 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-all focus:outline-none"
                            title="React to message"
                          >
                            <Smile size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {isTypingUser && (
                <div className="flex justify-start my-2 animate-pulse">
                  <div className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200/40 dark:border-zinc-800/80 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm text-xs flex items-center space-x-1.5 font-outfit">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-outfit pr-0.5">
                      {activeChatUser.name} is typing
                    </span>
                    <div className="flex items-center space-x-1 h-3">
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: 0,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-pink-500"
                      />
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: 0.15,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-pink-500"
                      />
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: 0.3,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-pink-500"
                      />
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
                {/* Unified AI Assistant Panel */}
                {showAIAssistant && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-slate-200/50 dark:border-zinc-800 p-3 bg-pink-50/10 dark:bg-zinc-950/20 space-y-3 rounded-t-3xl overflow-hidden shrink-0 border-t border-t-pink-100/10 dark:border-t-zinc-900/20 shadow-inner"
                  >
                    {/* Tab Header */}
                    <div className="flex items-center justify-between shrink-0 font-outfit border-b border-slate-100 dark:border-zinc-800/80 pb-2">
                      <div className="flex space-x-1 bg-slate-100 dark:bg-zinc-900/60 p-0.5 rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setAiTab("replies");
                            getSmartReplies(id);
                          }}
                          className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all duration-200 ${
                            aiTab === "replies"
                              ? "bg-white dark:bg-zinc-800 text-pink-500 shadow-sm"
                              : "text-slate-400 hover:text-slate-655 dark:hover:text-zinc-300"
                          }`}
                        >
                          <Sparkles size={11} />
                          <span>Smart Replies</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAiTab("icebreakers");
                            if (icebreakers.length === 0) {
                              getIcebreakers(id);
                            }
                          }}
                          className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all duration-200 ${
                            aiTab === "icebreakers"
                              ? "bg-white dark:bg-zinc-800 text-pink-500 shadow-sm"
                              : "text-slate-400 hover:text-slate-655 dark:hover:text-zinc-300"
                          }`}
                        >
                          <MessageCircle size={11} />
                          <span>Icebreakers</span>
                        </button>
                      </div>

                      {aiTab === "icebreakers" && (
                        <button
                          type="button"
                          onClick={() => getIcebreakers(id)}
                          className="text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 text-[10px] font-bold transition-colors duration-200 focus:outline-none select-none shrink-0"
                        >
                          Regenerate
                        </button>
                      )}
                      {aiTab === "replies" && (
                        <button
                          type="button"
                          onClick={() => getSmartReplies(id)}
                          className="text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 text-[10px] font-bold transition-colors duration-200 focus:outline-none select-none shrink-0"
                        >
                          Regenerate
                        </button>
                      )}
                    </div>

                    {/* Tab Contents */}
                    {aiTab === "replies" ? (
                      isLoadingSmartReplies ? (
                        <div className="flex py-4 justify-center">
                          <LoadingState message="" type="inline" />
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-1.5 max-h-36 overflow-y-auto overflow-x-hidden scrollbar-none pb-1">
                          {smartReplies.length > 0 ? (
                            smartReplies.map((reply, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setText(reply);
                                  setShowAIAssistant(false);
                                }}
                                className="w-full text-left bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-pink-50/20 dark:hover:bg-zinc-800 hover:border-pink-500/30 dark:hover:border-pink-500/30 transition-all font-medium leading-relaxed shadow-sm font-sans"
                              >
                                {reply}
                              </button>
                            ))
                          ) : (
                            <div className="text-center text-[10px] text-slate-400 py-3 italic font-medium">
                              No suggestions available. Try chatting more first!
                            </div>
                          )}
                        </div>
                      )
                    ) : isLoadingIcebreakers ? (
                      <div className="flex py-4 justify-center">
                        <LoadingState message="" type="inline" />
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-1.5 max-h-36 overflow-y-auto overflow-x-hidden scrollbar-none pb-1">
                        {icebreakers.length > 0 ? (
                          icebreakers.map((starter, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setText(starter);
                                setShowAIAssistant(false);
                              }}
                              className="w-full text-left bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-zinc-300 hover:bg-pink-50/20 dark:hover:bg-zinc-800 hover:border-pink-500/30 dark:hover:border-pink-500/30 transition-all font-medium leading-relaxed shadow-sm font-sans whitespace-normal break-words"
                            >
                              {starter}
                            </button>
                          ))
                        ) : (
                          <div className="text-center text-[10px] text-slate-400 py-3 italic font-medium">
                            No icebreakers available. Click regenerate to fetch!
                          </div>
                        )}
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
                        Search GIPHY GIFs
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
                              sendMessage("Sent a GIF", "image", g.url);
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
                  onClick={() =>
                    document.getElementById("chat-photo-input").click()
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 text-slate-550 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors focus:outline-none shrink-0"
                  title="Attach Photo"
                >
                  <Paperclip size={17} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setShowGifPicker(!showGifPicker);
                    setShowAIAssistant(false);
                  }}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus:outline-none shrink-0 ${
                    showGifPicker
                      ? "bg-pink-500 border-pink-500 text-white"
                      : "bg-slate-50 dark:bg-zinc-900 border-slate-200/50 dark:border-zinc-800 text-slate-550 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400"
                  }`}
                  title="Share GIF"
                >
                  <Smile size={17} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setIsDateModalOpen(true);
                    setShowGifPicker(false);
                    setShowAIAssistant(false);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 text-slate-550 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors focus:outline-none shrink-0"
                  title="Plan a Date"
                >
                  <Calendar size={17} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setShowAIAssistant(!showAIAssistant);
                    setShowGifPicker(false);
                    if (!showAIAssistant && aiTab === "replies") {
                      getSmartReplies(id);
                    }
                  }}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus:outline-none shrink-0 ${
                    showAIAssistant
                      ? "bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/25"
                      : "bg-slate-50 dark:bg-zinc-900 border-slate-200/50 dark:border-zinc-800 text-slate-550 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400"
                  }`}
                  title="AI Assistant"
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
                              isOnline
                                ? "bg-green-500"
                                : "bg-slate-350 dark:bg-zinc-700"
                            }`}
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center space-x-1.5 overflow-hidden">
                            <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-base leading-snug font-outfit truncate">
                              {match.name}
                            </h3>
                            {(() => {
                              const verifiedSaved = localStorage.getItem("verified-chats");
                              const verifiedMap = verifiedSaved ? JSON.parse(verifiedSaved) : {};
                              return verifiedMap[match._id] ? (
                                <span className="text-emerald-500 shrink-0 select-none animate-pulse" title="E2E Encryption Verified">
                                  <ShieldCheck size={14} className="fill-emerald-500/10 stroke-[2.2]" />
                                </span>
                              ) : null;
                            })()}
                          </div>
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
                <div className="space-y-1 select-none">
                  <button
                    onClick={() => setModalTab("info")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none font-outfit ${
                      modalTab === "info"
                        ? "bg-pink-500/10 text-pink-600 dark:text-pink-400 font-extrabold"
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-300 font-semibold"
                    }`}
                  >
                    Info
                  </button>
                  <button
                    onClick={() => setModalTab("media")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none font-outfit ${
                      modalTab === "media"
                        ? "bg-pink-500/10 text-pink-600 dark:text-pink-400 font-extrabold"
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-300 font-semibold"
                    }`}
                  >
                    Media, links and docs
                  </button>
                  <button
                    onClick={() => setModalTab("encryption")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none font-outfit ${
                      modalTab === "encryption"
                        ? "bg-pink-500/10 text-pink-600 dark:text-pink-400 font-extrabold"
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-300 font-semibold"
                    }`}
                  >
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
                          isOnline
                            ? "bg-green-500"
                            : "bg-slate-300 dark:bg-zinc-700"
                        }`}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200 leading-tight font-outfit">
                        {activeChatUser.name},{" "}
                        <span className="font-semibold">
                          {activeChatUser.age}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium font-sans">
                        {isOnline ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>

                  {modalTab === "info" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-outfit">
                          About
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-300 font-medium font-sans">
                          {activeChatUser.bio || "No bio available."}
                        </p>
                      </div>

                      {activeChatUser.interests &&
                        activeChatUser.interests.length > 0 && (
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
                  )}

                  {modalTab === "media" && (
                    <div className="space-y-3.5 flex-grow overflow-hidden flex flex-col min-h-0">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-outfit shrink-0">
                        Shared Media
                      </h4>
                      {messages.filter((msg) => msg.messageType === "image")
                        .length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-8 space-y-3 flex-grow min-h-[180px]">
                          <div className="rounded-full bg-slate-50 dark:bg-zinc-800/40 p-4 text-slate-400 dark:text-slate-550 border border-slate-100 dark:border-zinc-850">
                            <Image size={22} className="stroke-[1.8]" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-700 dark:text-zinc-300 font-outfit">
                              No shared media yet
                            </h5>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[220px] leading-relaxed font-sans font-medium">
                              Photos sent and received in this chat will be
                              grouped here.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2.5 max-h-[190px] overflow-y-auto pr-1 scrollbar-none shrink-0 pb-1">
                          {messages
                            .filter((msg) => msg.messageType === "image")
                            .map((msg) => (
                              <div
                                key={msg._id}
                                onClick={() =>
                                  setActiveLightboxImage(msg.mediaUrl)
                                }
                                className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-slate-150 dark:border-zinc-800/80 hover:scale-[1.03] active:scale-[0.97] transition-all hover:border-pink-500 dark:hover:border-pink-400 shadow-sm relative group bg-slate-50 dark:bg-zinc-950"
                              >
                                <img
                                  src={msg.mediaUrl}
                                  alt="Shared media"
                                  className="h-full w-full object-cover select-none"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {modalTab === "encryption" && (
                    <div className="space-y-3 flex-grow overflow-hidden flex flex-col min-h-0">
                      <div className="flex items-center space-x-2 shrink-0">
                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-outfit">
                          End-to-End Encryption
                        </h4>
                      </div>

                      <div className="bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-4 flex flex-col items-center text-center space-y-3.5 flex-grow overflow-y-auto scrollbar-none min-h-[180px] pb-5">
                        <motion.div
                          animate={{
                            scale: isEncryptionVerified ? [1, 1.15, 1] : 1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                          }}
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                            isEncryptionVerified
                              ? "bg-emerald-500 text-white animate-bounce"
                              : "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                          } shrink-0`}
                        >
                          {isEncryptionVerified ? (
                            <Check size={20} className="stroke-[3]" />
                          ) : (
                            <Lock size={18} className="stroke-[2.2]" />
                          )}
                        </motion.div>

                        <div className="space-y-1 shrink-0">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-200 font-outfit">
                            {isEncryptionVerified
                              ? "Connection Verified!"
                              : "Secure Communication"}
                          </h5>
                          <p className="text-[10px] text-slate-450 dark:text-slate-500 max-w-[280px] leading-relaxed font-sans font-medium">
                            Messages and calls are secured with E2E encryption.
                            No one outside of this chat can read or listen to
                            them.
                          </p>
                        </div>

                        <div className="w-full shrink-0">
                          <span className="text-[9px] font-bold text-slate-450 dark:text-zinc-500 uppercase tracking-widest font-outfit block mb-1.5">
                            Security fingerprint
                          </span>
                          <div className="bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800/80 rounded-xl py-2 px-3 text-center text-xs font-extrabold tracking-widest text-slate-600 dark:text-zinc-300 font-mono shadow-inner select-all">
                            {getVerificationFingerprint(
                              authUser?._id,
                              activeChatUser._id,
                            )}
                          </div>
                        </div>

                        {!isEncryptionVerified ? (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => {
                              const verifiedSaved =
                                localStorage.getItem("verified-chats");
                              const verifiedMap = verifiedSaved
                                ? JSON.parse(verifiedSaved)
                                : {};
                              verifiedMap[activeChatUser._id] = true;
                              localStorage.setItem(
                                "verified-chats",
                                JSON.stringify(verifiedMap),
                              );
                              setIsEncryptionVerified(true);
                              confetti({
                                particleCount: 60,
                                angle: 60,
                                spread: 55,
                                origin: { x: 0.4, y: 0.6 },
                              });
                              confetti({
                                particleCount: 60,
                                angle: 120,
                                spread: 55,
                                origin: { x: 0.6, y: 0.6 },
                              });
                            }}
                            className="w-full py-2 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm font-outfit flex items-center justify-center space-x-1.5 shrink-0"
                          >
                            <Shield size={12} className="stroke-[2.2]" />
                            <span>Verify Secure Link</span>
                          </motion.button>
                        ) : (
                          <div className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-xl font-outfit flex items-center justify-center space-x-1.5 shrink-0 border border-emerald-100 dark:border-emerald-900/30">
                            <Check size={12} className="stroke-[2.5]" />
                            <span>Verified Chat Channel</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
              className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 shadow-2xl p-6 font-sans text-slate-800 dark:text-zinc-100 rounded-[32px] relative overflow-visible"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-zinc-100 font-outfit flex items-center gap-2">
                  <Calendar size={18} className="text-pink-500" />
                  <span>Plan a Social Date</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDateModalOpen(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-650 dark:hover:text-slate-355 focus:outline-none"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 mb-5 font-sans leading-relaxed">
                Choose a cute activity, pick a date and time, and suggest a nice
                venue to meet {activeChatUser.name}!
              </p>

              <form onSubmit={handleSendDateProposal} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                    Choose Activity
                  </label>
                  <div className="flex flex-wrap gap-2 select-none">
                    {Object.entries(ACTIVITY_OPTIONS).map(([key, act]) => {
                      const isSelected = selectedActivity === key;
                      const IconComponent = act.icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedActivity(key)}
                          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-outfit border transition-colors ${
                            isSelected
                              ? "bg-pink-500 text-white border-pink-500"
                              : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700"
                          }`}
                        >
                          <IconComponent
                            size={14}
                            className={
                              isSelected
                                ? "text-white"
                                : "text-slate-400 dark:text-zinc-500"
                            }
                          />
                          <span>{act.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                      Date
                    </label>
                    <CustomDatePicker
                      value={dateInput}
                      onChange={setDateInput}
                      placeholder="Select Date"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                      Time
                    </label>
                    <CustomTimePicker
                      value={timeInput}
                      onChange={setTimeInput}
                      placeholder="Select Time"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                    Suggested Venue / Location
                  </label>
                  <div className="relative">
                    <MapPin
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500/80 pointer-events-none"
                    />
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

                <div className="pt-2 flex items-center space-x-3 w-full">
                  <button
                    type="button"
                    onClick={() => setIsDateModalOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all font-outfit focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 active:bg-pink-700 rounded-xl transition-colors font-outfit focus:outline-none flex items-center justify-center space-x-2"
                  >
                    <Calendar size={14} />
                    <span>Send Proposal</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {activeLightboxImage && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-4 right-4 text-white hover:text-pink-500 transition-colors p-2 bg-zinc-900/50 hover:bg-zinc-800/50 rounded-full select-none focus:outline-none"
              title="Close Lightbox"
            >
              <X size={20} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-[90vw] max-h-[80vh] flex flex-col items-center select-none"
            >
              <img
                src={activeLightboxImage}
                alt="Shared media lightbox"
                className="max-w-full max-h-[72vh] rounded-2xl object-contain shadow-2xl border border-zinc-800"
              />
              <div className="flex items-center space-x-3 mt-4 shrink-0">
                <a
                  href={activeLightboxImage}
                  download="shared_image.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-md transition-all font-outfit"
                >
                  <Paperclip size={13} />
                  <span>Open in Full Resolution</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
