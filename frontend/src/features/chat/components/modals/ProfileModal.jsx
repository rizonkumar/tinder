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
      className={`w-full text-left px-3.5 py-2.5 rounded-md text-xs font-bold transition-all focus:outline-none font-outfit ${
        isActive
          ? "bg-surface-active text-accent font-extrabold"
          : "text-foreground-muted hover:text-foreground-secondary font-semibold"
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
        <h4 className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-outfit">
          About
        </h4>
        <p className="text-xs leading-relaxed text-foreground-secondary font-medium font-sans">
          {activeChatUser.bio || "No bio available."}
        </p>
      </div>

      {activeChatUser.interests && activeChatUser.interests.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-outfit">
            Interests / Hobbies
          </h4>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-none">
            {activeChatUser.interests.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 border border-border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground-secondary shrink-0 font-outfit"
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
        <div className="rounded-full bg-background-secondary p-4 text-foreground-muted border border-border">
          <Image size={22} className="stroke-[1.8]" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-foreground font-outfit">
            No shared media yet
          </h5>
          <p className="text-[10px] text-foreground-muted mt-1 max-w-[220px] leading-relaxed font-sans font-medium">
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
          className="aspect-square rounded-md overflow-hidden cursor-pointer border border-border hover:scale-[1.03] active:scale-[0.97] transition-all hover:border-border-strong shadow-card relative group bg-background-secondary"
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
        <h4 className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-outfit">
          End-to-End Encryption
        </h4>
      </div>

      <div className="bg-background-secondary border border-border rounded-md p-4 flex flex-col items-center text-center space-y-3.5 flex-grow overflow-y-auto scrollbar-none min-h-[180px] pb-5">
        <motion.div
          animate={{
            scale: isEncryptionVerified ? [1, 1.15, 1] : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15,
          }}
          className={`flex h-11 w-11 items-center justify-center rounded-md ${
            isEncryptionVerified
              ? "bg-green-700 text-white animate-bounce"
              : "bg-primary text-primary-foreground shadow-card"
          } shrink-0`}
        >
          {isEncryptionVerified ? (
            <Check size={20} className="stroke-[3]" />
          ) : (
            <Lock size={18} className="stroke-[2.2]" />
          )}
        </motion.div>

        <div className="space-y-1 shrink-0">
          <h5 className="text-xs font-bold text-foreground font-outfit">
            {isEncryptionVerified
              ? "Connection Verified!"
              : "Secure Communication"}
          </h5>
          <p className="text-[10px] text-foreground-muted max-w-[280px] leading-relaxed font-sans font-medium">
            Messages and calls are secured with E2E encryption. No one outside
            of this chat can read or listen to them.
          </p>
        </div>

        <div className="w-full shrink-0">
          <span className="text-[9px] font-bold text-foreground-muted uppercase tracking-widest font-outfit block mb-1.5">
            Security fingerprint
          </span>
          <div className="bg-background border border-border rounded-md py-2 px-3 text-center text-xs font-extrabold tracking-widest text-foreground-secondary font-mono shadow-inner select-all">
            {getVerificationFingerprint(authUserId, chatUserId)}
          </div>
        </div>

        {!isEncryptionVerified ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleVerify}
            className="w-full py-2 bg-primary hover:bg-primary-hover text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md transition-all shadow-card font-outfit flex items-center justify-center space-x-1.5 shrink-0"
          >
            <Shield size={12} className="stroke-[2.2]" />
            <span>Verify Secure Link</span>
          </motion.button>
        ) : (
          <div className="w-full py-2 bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider rounded-md font-outfit flex items-center justify-center space-x-1.5 shrink-0 border border-green-300">
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
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={SPRING_TRANSITION}
            className="w-full max-w-2xl overflow-hidden rounded-lg bg-background border border-border shadow-modal flex flex-col sm:flex-row font-sans text-foreground max-h-[90vh] sm:h-[450px]"
          >
            <div className="w-full sm:w-[220px] bg-background-secondary border-b sm:border-b-0 sm:border-r border-border p-5 flex flex-col shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent font-outfit mb-4">
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
                      className="h-20 w-20 rounded-full border-2 border-border-strong object-cover shadow-card"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-4.5 w-4.5 rounded-full border-4 border-background ${
                        isOnline
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground leading-tight font-outfit">
                      {activeChatUser.name},{" "}
                      <span className="font-semibold">
                        {activeChatUser.age}
                      </span>
                    </h2>
                    <p className="text-xs text-foreground-muted mt-1 font-medium font-sans">
                      {isOnline ? "Active now" : "Offline"}
                    </p>
                  </div>
                </div>

                {modalTab === "info" && (
                  <InfoTabContent activeChatUser={activeChatUser} />
                )}

                {modalTab === "media" && (
                  <div className="space-y-3.5 flex-grow overflow-hidden flex flex-col min-h-0">
                    <h4 className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest font-outfit shrink-0">
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

              <div className="mt-6 border-t border-border pt-4 flex items-center justify-between shrink-0">
                {isOnline ? (
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onClose();
                        onInitiateCall(activeChatUser._id, "voice");
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background-secondary text-foreground-secondary hover:bg-surface-hover transition-all focus-ring"
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
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background-secondary text-foreground-secondary hover:bg-surface-hover transition-all focus-ring"
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
                  className="px-5 py-2 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold shadow-card focus:outline-none font-outfit"
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
