import { Phone, Video, Check, ShieldCheck, Lock, ImageOff, Info, Images, X } from "lucide-react";
import { Modal } from "../../../../components/ui/Modal";
import { Tabs } from "../../../../components/ui/Tabs";
import { Badge } from "../../../../components/ui/Badge";
import { Avatar } from "../../../../components/ui/Avatar";
import { Button } from "../../../../components/ui/Button";
import { IconButton } from "../../../../components/ui/IconButton";
import { EmptyState } from "../../../../components/ui/EmptyState";

const TABS = [
  { value: "info", label: "About", icon: Info },
  { value: "media", label: "Media", icon: Images },
  { value: "encryption", label: "Security", icon: Lock },
];

function InfoTab({ user }) {
  return (
    <div className="space-y-5">
      <section>
        <p className="eyebrow">Bio</p>
        <p className="copy-14 mt-1.5 text-foreground-secondary">{user.bio || "No bio yet."}</p>
      </section>
      {user.interests?.length > 0 && (
        <section>
          <p className="eyebrow">Interests</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {user.interests.map((interest) => (
              <Badge key={interest}>{interest}</Badge>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MediaTab({ messages, onOpenLightbox }) {
  const media = messages.filter((message) => message.messageType === "image" && !message.isDeleted);
  if (media.length === 0) {
    return <EmptyState compact icon={ImageOff} title="No shared photos" description="Photos you send each other show up here." />;
  }
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {media.map((message) => (
        <button
          key={message._id}
          type="button"
          onClick={() => onOpenLightbox(message.mediaUrl)}
          className="aspect-square overflow-hidden rounded-md bg-background-secondary focus-ring"
          aria-label="Open photo"
        >
          <img src={message.mediaUrl} alt="" loading="lazy" className="size-full object-cover transition-opacity hover:opacity-90" />
        </button>
      ))}
    </div>
  );
}

function SecurityTab({ isVerified, onVerify, fingerprint }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background-secondary text-foreground-secondary">
          {isVerified ? <ShieldCheck size={17} className="text-success" /> : <Lock size={17} />}
        </span>
        <div>
          <p className="label-14 text-foreground">{isVerified ? "Chat verified" : "End-to-end encrypted"}</p>
          <p className="copy-13 text-foreground-secondary">
            Compare this code with your match in person or on a call. If it matches, mark the chat as verified.
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-background-secondary px-4 py-3 text-center font-mono text-sm tracking-[0.2em] text-foreground select-all">
        {fingerprint}
      </div>
      {isVerified ? (
        <Badge tone="success" icon={Check}>Verified on this device</Badge>
      ) : (
        <Button variant="secondary" className="w-full" onClick={onVerify}>
          <ShieldCheck aria-hidden="true" />
          Mark as verified
        </Button>
      )}
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
  const startCall = (type) => {
    onClose();
    onInitiateCall(activeChatUser._id, type);
  };

  return (
    <Modal open={isOpen && !!activeChatUser} onClose={onClose} size="md">
      {activeChatUser && (
        <>
          <div className="flex items-center gap-4 border-b border-border p-5">
            <Avatar src={activeChatUser.image} alt={activeChatUser.name} size="xl" online={isOnline} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="heading-20 truncate text-foreground">
                  {activeChatUser.name}
                  {activeChatUser.age && <span className="ml-1.5 font-normal text-foreground-secondary">{activeChatUser.age}</span>}
                </h2>
                {isEncryptionVerified && <ShieldCheck size={16} className="shrink-0 text-success" aria-label="Verified chat" />}
              </div>
              <p className={isOnline ? "copy-13 text-success" : "copy-13 text-foreground-muted"}>{isOnline ? "Active now" : "Offline"}</p>
            </div>
            {isOnline && (
              <div className="flex shrink-0 gap-1">
                <IconButton label="Voice call" variant="outline" onClick={() => startCall("voice")}>
                  <Phone />
                </IconButton>
                <IconButton label="Video call" variant="outline" onClick={() => startCall("video")}>
                  <Video />
                </IconButton>
              </div>
            )}
            <IconButton label="Close" size="sm" onClick={onClose} className="-mr-1.5 self-start">
              <X />
            </IconButton>
          </div>
          <div className="px-5">
            <Tabs tabs={TABS} value={modalTab} onChange={onSetModalTab} layoutId="contact-tabs" />
          </div>
          <div className="min-h-[14rem] p-5">
            {modalTab === "info" && <InfoTab user={activeChatUser} />}
            {modalTab === "media" && <MediaTab messages={messages} onOpenLightbox={onOpenLightbox} />}
            {modalTab === "encryption" && (
              <SecurityTab
                isVerified={isEncryptionVerified}
                onVerify={() => onVerifyEncryption(activeChatUser._id)}
                fingerprint={getVerificationFingerprint(authUserId, activeChatUser._id)}
              />
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
