import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";
import { useCallStore } from "../store/useCallStore";

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
  } = useCallStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (callState === "idle") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 p-2 sm:p-4 backdrop-blur-xl select-none text-white"
      >
        {callState === "ringing" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center max-w-sm px-4"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-pink-500/25 blur-md"
              />
              <img
                src={callerInfo?.image || "/avatar.png"}
                alt={callerInfo?.name}
                className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-pink-400 object-cover shadow-2xl"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide">
              {callerInfo?.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-pink-300 font-medium uppercase tracking-wider animate-pulse">
              Incoming {callType} call...
            </p>

            <div className="mt-12 flex items-center space-x-6 sm:space-x-8">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={rejectIncomingCall}
                className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 focus:outline-none"
              >
                <PhoneOff size={24} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={acceptIncomingCall}
                className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 focus:outline-none"
              >
                <Phone size={24} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {callState === "calling" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center max-w-sm px-4"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-blue-500/25 blur-md"
              />
              <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-blue-400 shadow-2xl flex items-center justify-center bg-gray-800">
                <Phone size={36} className="text-blue-300 animate-bounce" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
              Calling...
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-blue-300 font-medium uppercase tracking-wider animate-pulse">
              Waiting for match to answer...
            </p>

            <div className="mt-12">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={endCall}
                className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 focus:outline-none"
              >
                <PhoneOff size={24} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {callState === "connected" && (
          <div
            ref={containerRef}
            className="relative h-[85vh] sm:h-full w-full max-w-4xl overflow-hidden rounded-3xl bg-black/60 shadow-2xl border border-white/5"
          >
            {callType === "video" ? (
              <div className="h-full w-full relative">
                {remoteStream ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover rounded-3xl"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-900 text-sm tracking-widest text-gray-500">
                    CONNECTING MEDIA FEED...
                  </div>
                )}

                {localStream && (
                  <motion.div
                    drag
                    dragConstraints={containerRef}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 h-28 w-20 sm:h-40 sm:w-28 overflow-hidden rounded-2xl border-2 border-white shadow-2xl cursor-grab active:cursor-grabbing shrink-0"
                  >
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center space-y-6 bg-gradient-to-b from-gray-900 via-purple-950/20 to-gray-900 rounded-3xl px-4">
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-pink-500/20 blur-md"
                  />
                  <img
                    src={callerInfo?.image || "/avatar.png"}
                    alt={callerInfo?.name}
                    className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-pink-400/40 object-cover shadow-2xl"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-wide">
                  Active Voice Call
                </h3>
                <p className="text-[10px] sm:text-xs text-pink-300 font-semibold tracking-widest uppercase">
                  Connected
                </p>
                {localStream && (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="hidden"
                  />
                )}
                {remoteStream && (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="hidden"
                  />
                )}
              </div>
            )}

            <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-4 sm:space-x-6 rounded-full border border-white/10 bg-black/60 px-5 sm:px-8 py-2.5 sm:py-3.5 backdrop-blur-md shadow-2xl">
              <button
                onClick={toggleMic}
                className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-colors ${
                  micActive
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {micActive ? <Mic size={18} /> : <MicOff size={18} />}
              </button>

              {callType === "video" && (
                <button
                  onClick={toggleCamera}
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-colors ${
                    cameraActive
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {cameraActive ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
              )}

              <button
                onClick={endCall}
                className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
