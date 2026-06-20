import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMatchStore } from "../../store/useMatchStore";
import { useMessageStore } from "../../store/useMessageStore";
import { useAuthStore } from "../../store/useAuthStore";
import AppLayout from "../../components/AppLayout";
import { useCallStore } from "../../store/useCallStore";

import { useChatInit } from "./hooks/useChatInit";
import { useMessageSearch } from "./hooks/useMessageSearch";
import { useReactions } from "./hooks/useReactions";
import { useTypingIndicator } from "./hooks/useTypingIndicator";
import { useGifPicker } from "./hooks/useGifPicker";
import { useEncryptionVerification } from "./hooks/useEncryptionVerification";

import ChatHeader from "./components/ChatHeader";
import MessageSearchBar from "./components/MessageSearchBar";
import MessageList from "./components/MessageList";
import ChatInputBar from "./components/ChatInputBar";
import AIAssistantPanel from "./components/AIAssistantPanel";
import GifPickerPanel from "./components/GifPickerPanel";
import NoChatSelected from "./components/NoChatSelected";
import DatePlannerPanel from "./components/DatePlannerPanel";
import { AnimatePresence } from "framer-motion";

import ProfileModal from "./components/modals/ProfileModal";
import DateProposalModal from "./components/modals/DateProposalModal";
import TwoTruthsLieModal from "./components/modals/TwoTruthsLieModal";
import ImageLightbox from "./components/modals/ImageLightbox";

export default function ChatPage() {
  const { id } = useParams();
  const { matches, isLoadingMyMatches } = useMatchStore();
  const { authUser, onlineUsers } = useAuthStore();
  const initiateCall = useCallStore((state) => state.initiateCall);
  const {
    activeChatUser,
    isLoadingMessages,
    messages,
    sendMessage,
    respondToDateProposal,
    respondToGameProposal,
    icebreakers,
    isLoadingIcebreakers,
    getIcebreakers,
    smartReplies,
    isLoadingSmartReplies,
    getSmartReplies,
    isTypingUser,
    editingMessage,
    setEditingMessage,
    editMessage,
    setReplyingTo,
    togglePin,
  } = useMessageStore();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("info");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);
  const [isDatePlannerOpen, setIsDatePlannerOpen] = useState(false);

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiTab, setAiTab] = useState("replies");

  const { messagesEndRef } = useChatInit(id);
  const {
    showSearchBar,
    searchQuery,
    searchMatches,
    currentMatchIndex,
    activeHighlightedMessageId,
    handleSearch,
    scrollToAndHighlight,
    nextSearchMatch,
    prevSearchMatch,
    toggleSearchBar,
    resetSearch,
  } = useMessageSearch(id);
  const {
    reactions,
    activeReactionPickerMessageId,
    addReaction,
    toggleReactionPicker,
  } = useReactions(id);
  const { text, setText, handleTextChange, handleSend } = useTypingIndicator();

  const handleCustomSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (editingMessage) {
      await editMessage(editingMessage._id, text.trim());
      setEditingMessage(null);
      setText("");
    } else {
      await handleSend(e);
    }
  };

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.content);
    } else {
      setText("");
    }
  }, [editingMessage, setText]);
  const {
    showGifPicker,
    setShowGifPicker,
    gifQuery,
    setGifQuery,
    gifs,
    isLoadingGifs,
    handleImageUpload,
  } = useGifPicker();
  const { isEncryptionVerified, getVerificationFingerprint, verifyEncryption } =
    useEncryptionVerification(id);

  useEffect(() => {
    setIsProfileModalOpen(false);
    setIsDateModalOpen(false);
    setIsGameModalOpen(false);
    setModalTab("info");
    setShowAIAssistant(false);
    resetSearch();
    setShowGifPicker(false);
    setIsDatePlannerOpen(false);
  }, [id, resetSearch, setShowGifPicker]);

  const isOnline = activeChatUser
    ? onlineUsers.includes(activeChatUser._id)
    : false;

  const handleToggleGifPicker = () => {
    setShowGifPicker((prev) => !prev);
    setShowAIAssistant(false);
  };

  const handleToggleAIAssistant = () => {
    setShowAIAssistant((prev) => {
      const next = !prev;
      setShowGifPicker(false);
      if (next && aiTab === "replies") {
        getSmartReplies(id);
      }
      return next;
    });
  };

  const handleSelectAiTab = (tab) => {
    setAiTab(tab);
    if (tab === "replies") {
      getSmartReplies(id);
    } else if (tab === "icebreakers" && icebreakers.length === 0) {
      getIcebreakers(id);
    }
  };

  return (
    <AppLayout variant="flush">
        {activeChatUser ? (
          <div className="flex flex-grow flex-row overflow-hidden bg-background border-t border-border lg:border-l lg:border-t-0 transition-colors duration-300">
            <div className="flex flex-grow flex-col overflow-hidden">
              <ChatHeader
                activeChatUser={activeChatUser}
                isOnline={isOnline}
                isEncryptionVerified={isEncryptionVerified}
                showSearchBar={showSearchBar}
                onToggleSearch={toggleSearchBar}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                onInitiateCall={(type) => initiateCall(activeChatUser._id, type)}
                onOpenDatePlanner={() => setIsDatePlannerOpen((prev) => !prev)}
              />

            <MessageSearchBar
              showSearchBar={showSearchBar}
              searchQuery={searchQuery}
              onSearch={handleSearch}
              searchMatches={searchMatches}
              currentMatchIndex={currentMatchIndex}
              onPrev={prevSearchMatch}
              onNext={nextSearchMatch}
              onClose={toggleSearchBar}
            />

            <MessageList
              messages={messages}
              isLoadingMessages={isLoadingMessages}
              activeChatUser={activeChatUser}
              authUser={authUser}
              isTypingUser={isTypingUser}
              activeHighlightedMessageId={activeHighlightedMessageId}
              reactions={reactions}
              activeReactionPickerMessageId={activeReactionPickerMessageId}
              onToggleReactionPicker={toggleReactionPicker}
              onAddReaction={addReaction}
              onOpenLightbox={setActiveLightboxImage}
              onRespondToDate={respondToDateProposal}
              onRespondToGame={respondToGameProposal}
              onReply={setReplyingTo}
              onTogglePin={togglePin}
              onScrollToMessage={scrollToAndHighlight}
              messagesEndRef={messagesEndRef}
            />

            <ChatInputBar
              text={text}
              onTextChange={handleTextChange}
              onSend={handleCustomSend}
              onImageUpload={handleImageUpload}
              showGifPicker={showGifPicker}
              onToggleGifPicker={handleToggleGifPicker}
              showAIAssistant={showAIAssistant}
              onToggleAIAssistant={handleToggleAIAssistant}
              onOpenDateModal={() => {
                setIsDateModalOpen(true);
                setIsGameModalOpen(false);
                setShowGifPicker(false);
                setShowAIAssistant(false);
              }}
              onOpenGameModal={() => {
                setIsGameModalOpen(true);
                setIsDateModalOpen(false);
                setShowGifPicker(false);
                setShowAIAssistant(false);
              }}
            >
              {showAIAssistant && (
                <AIAssistantPanel
                  aiTab={aiTab}
                  onSetAiTab={handleSelectAiTab}
                  smartReplies={smartReplies}
                  isLoadingSmartReplies={isLoadingSmartReplies}
                  icebreakers={icebreakers}
                  isLoadingIcebreakers={isLoadingIcebreakers}
                  onSelectReply={(starter) => {
                    setText(starter);
                    setShowAIAssistant(false);
                  }}
                  onRegenerateReplies={() => getSmartReplies(id)}
                  onRegenerateIcebreakers={() => getIcebreakers(id)}
                  chatId={id}
                />
              )}

              {showGifPicker && (
                <GifPickerPanel
                  gifQuery={gifQuery}
                  onGifQueryChange={setGifQuery}
                  gifs={gifs}
                  isLoadingGifs={isLoadingGifs}
                  onSelectGif={(gif) => {
                    sendMessage("", "image", gif.url);
                    setShowGifPicker(false);
                  }}
                  onClose={() => setShowGifPicker(false)}
                />
              )}
            </ChatInputBar>
          </div>
          <AnimatePresence>
            {isDatePlannerOpen && (
              <DatePlannerPanel
                isOpen={isDatePlannerOpen}
                onClose={() => setIsDatePlannerOpen(false)}
                matchUser={activeChatUser}
              />
            )}
          </AnimatePresence>
        </div>
        ) : (
          <NoChatSelected
            matches={matches}
            isLoadingMyMatches={isLoadingMyMatches}
            onlineUsers={onlineUsers}
          />
        )}

      <ProfileModal
        isOpen={isProfileModalOpen}
        activeChatUser={activeChatUser}
        isOnline={isOnline}
        messages={messages}
        modalTab={modalTab}
        onSetModalTab={setModalTab}
        isEncryptionVerified={isEncryptionVerified}
        onVerifyEncryption={verifyEncryption}
        getVerificationFingerprint={getVerificationFingerprint}
        authUserId={authUser?._id}
        onClose={() => setIsProfileModalOpen(false)}
        onInitiateCall={initiateCall}
        onOpenLightbox={setActiveLightboxImage}
      />

      <DateProposalModal
        isOpen={isDateModalOpen}
        activeChatUser={activeChatUser}
        onClose={() => setIsDateModalOpen(false)}
        onSendProposal={sendMessage}
      />

      <TwoTruthsLieModal
        isOpen={isGameModalOpen}
        activeChatUser={activeChatUser}
        onClose={() => setIsGameModalOpen(false)}
        onSendChallenge={sendMessage}
      />

      <ImageLightbox
        imageUrl={activeLightboxImage}
        onClose={() => setActiveLightboxImage(null)}
      />
    </AppLayout>
  );
}
