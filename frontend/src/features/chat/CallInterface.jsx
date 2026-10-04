import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";
import { useCallStore } from "../../store/useCallStore";
import { useMessageStore } from "../../store/useMessageStore";
import { CALL_STATES, CALL_REACTIONS } from "../../constants";
import { cn } from "../../utils/cn";

const CALL_SURFACE = "bg-[#141210]";

function RoundControl({ label, onClick, tone = "neutral", size = "md", children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-white transition-colors focus-ring",
        size === "lg" ? "size-14" : "size-11",
        tone === "danger" && "bg-[#c0392b] hover:bg-[#a12f23]",
        tone === "success" && "bg-[#2f7d4a] hover:bg-[#26663c]",
        tone === "neutral" && "bg-white/10 hover:bg-white/20",
        tone === "off" && "bg-white text-[#141210] hover:bg-white/90"
      )}
    >
      {children}
    </button>
  );
}

function CallerIdentity({ name, image, status }) {
  return (
    <div className="flex flex-col items-center text-center">
      <img src={image || "/avatar.png"} alt={name || ""} className="size-28 rounded-full object-cover ring-1 ring-white/15 sm:size-32" />
      <h2 className="heading-24 mt-6 text-white">{name || "Your match"}</h2>
      <p className="copy-14 mt-1 text-white/60">{status}</p>
    </div>
  );
}

export default function CallInterface() {
  const {
    callState,
    callType,
    callerInfo,
    localStream,
    remoteStream,
    micActive,
    cameraActive,
    acceptIncomingCall,
    rejectIncomingCall,
    endCall,
    toggleMic,
    toggleCamera,
    activeReactions,
    sendCallReaction,
  } = useCallStore();

  const activeChatUser = useMessageStore((state) => state.activeChatUser);
  const peer = callerInfo || activeChatUser;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
  }, [localStream, callState]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream, callState]);

  const isVideo = callType === "video";

  return (
    <AnimatePresence>
      {callState !== CALL_STATES.IDLE && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${isVideo ? "Video" : "Voice"} call`}
          className={cn("fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 text-white", CALL_SURFACE)}
        >
          {callState === CALL_STATES.RINGING && (
            <div className="flex flex-col items-center gap-12">
              <CallerIdentity name={peer?.name} image={peer?.image} status={`Incoming ${isVideo ? "video" : "voice"} call`} />
              <div className="flex items-center gap-10">
                <div className="flex flex-col items-center gap-2">
                  <RoundControl label="Decline" tone="danger" size="lg" onClick={rejectIncomingCall}>
                    <PhoneOff size={22} />
                  </RoundControl>
                  <span className="text-xs text-white/60">Decline</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <RoundControl label="Accept" tone="success" size="lg" onClick={acceptIncomingCall}>
                    {isVideo ? <Video size={22} /> : <Phone size={22} />}
                  </RoundControl>
                  <span className="text-xs text-white/60">Accept</span>
                </div>
              </div>
            </div>
          )}

          {callState === CALL_STATES.CALLING && (
            <div className="flex flex-col items-center gap-12">
              <CallerIdentity name={peer?.name} image={peer?.image} status="Calling…" />
              <RoundControl label="Cancel call" tone="danger" size="lg" onClick={endCall}>
                <PhoneOff size={22} />
              </RoundControl>
            </div>
          )}

          {callState === CALL_STATES.CONNECTED && (
            <div ref={containerRef} className="relative h-full w-full max-w-5xl overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
              {isVideo ? (
                remoteStream ? (
                  <video ref={remoteVideoRef} autoPlay playsInline className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-sm text-white/60">Connecting video…</div>
                )
              ) : (
                <div className="flex size-full items-center justify-center">
                  <CallerIdentity name={peer?.name} image={peer?.image} status="Connected" />
                  {remoteStream && <audio ref={remoteVideoRef} autoPlay className="hidden" />}
                </div>
              )}

              {isVideo && localStream && (
                <motion.div
                  drag
                  dragConstraints={containerRef}
                  dragMomentum={false}
                  className="absolute right-4 top-4 z-30 h-36 w-24 cursor-grab overflow-hidden rounded-lg ring-2 ring-white/80 active:cursor-grabbing sm:h-44 sm:w-32"
                >
                  <video ref={localVideoRef} autoPlay playsInline muted className="size-full object-cover" />
                </motion.div>
              )}

              <div className="pointer-events-none absolute inset-0 z-[45] overflow-hidden" aria-hidden="true">
                <AnimatePresence>
                  {activeReactions.map((reaction) => (
                    <motion.span
                      key={reaction.id}
                      initial={{ y: 0, opacity: 0, scale: 0.8 }}
                      animate={{ y: -280, opacity: [0, 1, 1, 0], scale: 1.6 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2.6, ease: "easeOut" }}
                      className="absolute bottom-28 left-1/2 -translate-x-1/2 text-4xl"
                    >
                      {reaction.reaction}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-40 flex flex-col items-center gap-3 p-4 sm:p-6">
                <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 ring-1 ring-white/10">
                  {CALL_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => sendCallReaction(emoji)}
                      aria-label={`Send ${emoji}`}
                      className="flex size-9 items-center justify-center rounded-full text-xl transition-colors hover:bg-white/10 focus-ring"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 rounded-full bg-black/60 px-3 py-2 ring-1 ring-white/10">
                  <RoundControl label={micActive ? "Mute microphone" : "Unmute microphone"} tone={micActive ? "neutral" : "off"} onClick={toggleMic}>
                    {micActive ? <Mic size={18} /> : <MicOff size={18} />}
                  </RoundControl>
                  {isVideo && (
                    <RoundControl label={cameraActive ? "Turn camera off" : "Turn camera on"} tone={cameraActive ? "neutral" : "off"} onClick={toggleCamera}>
                      {cameraActive ? <Video size={18} /> : <VideoOff size={18} />}
                    </RoundControl>
                  )}
                  <RoundControl label="End call" tone="danger" onClick={endCall}>
                    <PhoneOff size={18} />
                  </RoundControl>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
