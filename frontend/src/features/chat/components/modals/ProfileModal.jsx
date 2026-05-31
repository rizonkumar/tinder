import { Phone, Video, Check, Shield, Lock, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const SPRING_TRANSITION = { type: "spring", stiffness: 350, damping: 25 };

const TAB_OPTIONS = [
  { key: "info", label: "Info" },
  { key: "media", label: "Media, links and docs" },
  { key: "encryption", label: "Encryption" },
];

function SidebarTab({ tabKey, label, activeTab, onSelect }) {
  const isActive = activeTab === tabKey;
  return (
    <button
      onClick={() => onSelect(tabKey)}
      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none font-outfit ${
        isActive
          ? "bg-pink-500/10 text-pink-600 dark:text-pink-400 font-extrabold"
          : "text-slate-400 dark:text-slate-500 hover:text-slate-655 dark:hover:text-slate-300 font-semibold"
      }`}
    >
      {label}
    </button>
  );
}

function InfoTabContent({ activeChatUser }) {
  return (
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
  );
}

function MediaTabContent({ messages, onOpenLightbox }) {
  const mediaMessages = messages.filter((msg) => msg.messageType === "image");

  if (mediaMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 space-y-3 flex-grow min-h-[180px]">
        <div className="rounded-full bg-slate-50 dark:bg-zinc-800/40 p-4 text-slate-400 dark:text-slate-550 border border-slate-100 dark:border-zinc-850">
          <Image size={22} className="stroke-[1.8]" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-slate-700 dark:text-zinc-300 font-outfit">
            No shared media yet
          </h5>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[220px] leading-relaxed font-sans font-medium">
            Photos sent and received in this chat will be grouped here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2.5 max-h-[190px] overflow-y-auto pr-1 scrollbar-none shrink-0 pb-1">
      {mediaMessages.map((msg) => (
        <div
          key={msg._id}
          onClick={() => onOpenLightbox(msg.mediaUrl)}
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
  );
}

function EncryptionTabContent({
  isEncryptionVerified,
  onVerifyEncryption,
  getVerificationFingerprint,
  authUserId,
  chatUserId,
}) {
  const handleVerify = () => {
    onVerifyEncryption(chatUserId);
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
  };

  return (
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
            Messages and calls are secured with E2E encryption. No one outside
            of this chat can read or listen to them.
          </p>
        </div>

        <div className="w-full shrink-0">
          <span className="text-[9px] font-bold text-slate-450 dark:text-zinc-500 uppercase tracking-widest font-outfit block mb-1.5">
            Security fingerprint
          </span>
          <div className="bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800/80 rounded-xl py-2 px-3 text-center text-xs font-extrabold tracking-widest text-slate-600 dark:text-zinc-300 font-mono shadow-inner select-all">
            {getVerificationFingerprint(authUserId, chatUserId)}
          </div>
        </div>

        {!isEncryptionVerified ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleVerify}
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
  );
}

export default function ProfileModal({
  isOpen,
  activeChatUser,
  isOnline,
  messages,
  modalTab,
  onSetModalTab,
  isEncryptionVerified,
  onVerifyEncryption,
  getVerificationFingerprint,
  authUserId,
  onClose,
  onInitiateCall,
  onOpenLightbox,
}) {
  return (
    <AnimatePresence>
      {isOpen && activeChatUser && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={SPRING_TRANSITION}
            className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 shadow-2xl flex flex-col sm:flex-row font-sans text-slate-800 dark:text-zinc-100 max-h-[90vh] sm:h-[450px]"
          >
            <div className="w-full sm:w-[220px] bg-slate-50 dark:bg-zinc-950 border-b sm:border-b-0 sm:border-r border-slate-200/50 dark:border-zinc-800/80 p-5 flex flex-col shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 font-outfit mb-4">
                Contact
              </h3>
              <div className="space-y-1 select-none">
                {TAB_OPTIONS.map((tab) => (
                  <SidebarTab
                    key={tab.key}
                    tabKey={tab.key}
                    label={tab.label}
                    activeTab={modalTab}
                    onSelect={onSetModalTab}
                  />
                ))}
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
                  <InfoTabContent activeChatUser={activeChatUser} />
                )}

                {modalTab === "media" && (
                  <div className="space-y-3.5 flex-grow overflow-hidden flex flex-col min-h-0">
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-outfit shrink-0">
                      Shared Media
                    </h4>
                    <MediaTabContent
                      messages={messages}
                      onOpenLightbox={onOpenLightbox}
                    />
                  </div>
                )}

                {modalTab === "encryption" && (
                  <EncryptionTabContent
                    isEncryptionVerified={isEncryptionVerified}
                    onVerifyEncryption={onVerifyEncryption}
                    getVerificationFingerprint={getVerificationFingerprint}
                    authUserId={authUserId}
                    chatUserId={activeChatUser._id}
                  />
                )}
              </div>

              <div className="mt-6 border-t border-slate-100 dark:border-zinc-800/80 pt-4 flex items-center justify-between shrink-0">
                {isOnline ? (
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onClose();
                        onInitiateCall(activeChatUser._id, "voice");
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
                    >
                      <Phone size={15} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onClose();
                        onInitiateCall(activeChatUser._id, "video");
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
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-xs font-bold shadow-sm focus:outline-none font-outfit"
                >
                  Done
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
