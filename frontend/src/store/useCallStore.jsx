import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { useMessageStore } from "./useMessageStore";
import showToast from "../components/common/Toast";
import webrtcService from "../services/webrtc";
import socketService from "../services/socket";

export const useCallStore = create((set, get) => ({
  callState: "idle",
  callType: null,
  targetId: null,
  callerInfo: null,
  localStream: null,
  remoteStream: null,
  micActive: true,
  cameraActive: true,
  offer: null,
  callStartTime: null,
  activeReactions: [],

  sendCallReaction: (reaction) => {
    const { targetId } = get();
    const socket = socketService.getSocket();
    if (socket && targetId) {
      socket.emit("callReaction", { targetId, reaction });
      
      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      const newReaction = { id, reaction };
      set((state) => ({ activeReactions: [...state.activeReactions, newReaction] }));
      
      setTimeout(() => {
        set((state) => ({
          activeReactions: state.activeReactions.filter((r) => r.id !== id),
        }));
      }, 4000);
    }
  },

  initiateCall: async (targetId, callType) => {
    try {
      set({
        callState: "calling",
        callType,
        targetId,
        micActive: true,
        cameraActive: true,
        callStartTime: null,
      });

      const constraints = {
        audio: true,
        video: callType === "video",
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      set({ localStream: stream });

      webrtcService.createPeerConnection(targetId, stream, (remoteStream) => {
        set({ remoteStream });
      });

      const offer = await webrtcService.createOffer();
      
      const socket = socketService.getSocket();
      const authUser = useAuthStore.getState().authUser;
      if (socket && authUser && offer) {
        socket.emit("callUser", {
          targetId,
          offer,
          callType,
          callerInfo: {
            name: authUser.name,
            image: authUser.image,
          },
        });
      }
    } catch (error) {
      console.error(error);
      showToast.error("Could not access camera or microphone");
      get().endCall();
    }
  },

  acceptIncomingCall: async () => {
    try {
      const { callType, targetId, offer } = get();
      set({ callState: "connected", callStartTime: Date.now() });

      const constraints = {
        audio: true,
        video: callType === "video",
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      set({ localStream: stream });

      webrtcService.createPeerConnection(targetId, stream, (remoteStream) => {
        set({ remoteStream });
      });

      const answer = await webrtcService.createAnswer(offer);

      const socket = socketService.getSocket();
      if (socket && answer) {
        socket.emit("acceptCall", { targetId, answer });
      }
    } catch (error) {
      console.error(error);
      showToast.error("Could not access camera or microphone");
      get().endCall();
    }
  },

  rejectIncomingCall: () => {
    const { targetId, callType } = get();
    const socket = socketService.getSocket();
    if (socket && targetId) {
      socket.emit("disconnectCall", { targetId });
    }

    if (targetId && callType) {
      const content = `Missed ${callType === "video" ? "video" : "voice"} call`;
      useMessageStore
        .getState()
        .sendMessage(content, callType === "video" ? "video" : "audio");
    }

    set({
      callState: "idle",
      callType: null,
      targetId: null,
      callerInfo: null,
      localStream: null,
      remoteStream: null,
      offer: null,
      callStartTime: null,
    });
  },

  endCall: () => {
    const { targetId, localStream, callStartTime, callType } = get();
    const socket = socketService.getSocket();
    if (socket && targetId) {
      socket.emit("disconnectCall", { targetId });
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    webrtcService.closeConnection();

    if (targetId && callType) {
      let content = `Missed ${callType === "video" ? "video" : "voice"} call`;
      if (callStartTime) {
        const durationSecs = Math.floor((Date.now() - callStartTime) / 1000);
        const minutes = Math.floor(durationSecs / 60);
        const seconds = durationSecs % 60;
        const durationStr =
          minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        content = `${callType === "video" ? "Video" : "Voice"} call ended (${durationStr})`;
      }
      useMessageStore
        .getState()
        .sendMessage(content, callType === "video" ? "video" : "audio");
    }

    set({
      callState: "idle",
      callType: null,
      targetId: null,
      callerInfo: null,
      localStream: null,
      remoteStream: null,
      micActive: true,
      cameraActive: true,
      offer: null,
      callStartTime: null,
    });
  },

  toggleMic: () => {
    const { localStream, micActive } = get();
    webrtcService.toggleTrack(localStream, "audio", !micActive);
    set({ micActive: !micActive });
  },

  toggleCamera: () => {
    const { localStream, cameraActive } = get();
    webrtcService.toggleTrack(localStream, "video", !cameraActive);
    set({ cameraActive: !cameraActive });
  },

  setupCallListeners: (socket) => {
    if (!socket) return;

    socket.off("incomingCall");
    socket.off("callAccepted");
    socket.off("receiveIceCandidate");
    socket.off("callEnded");
    socket.off("callReaction");

    socket.on("incomingCall", ({ callerId, offer, callType, callerInfo }) => {
      set({
        callState: "ringing",
        callType,
        targetId: callerId,
        callerInfo,
        offer,
        callStartTime: null,
      });
    });

    socket.on("callAccepted", async ({ answer }) => {
      set({ callState: "connected", callStartTime: Date.now() });
      await webrtcService.setRemoteDescription(answer);
    });

    socket.on("receiveIceCandidate", async ({ candidate }) => {
      await webrtcService.addIceCandidate(candidate);
    });

    socket.on("callReaction", ({ reaction }) => {
      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      const newReaction = { id, reaction };
      set((state) => ({ activeReactions: [...state.activeReactions, newReaction] }));
      
      setTimeout(() => {
        set((state) => ({
          activeReactions: state.activeReactions.filter((r) => r.id !== id),
        }));
      }, 4000);
    });

    socket.on("callEnded", () => {
      const { localStream } = get();
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      webrtcService.closeConnection();
      set({
        callState: "idle",
        callType: null,
        targetId: null,
        callerInfo: null,
        localStream: null,
        remoteStream: null,
        micActive: true,
        cameraActive: true,
        offer: null,
        callStartTime: null,
        activeReactions: [],
      });
      showToast.error("Call ended");
    });
  },
}));
