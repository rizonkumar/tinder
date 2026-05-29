import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { useMessageStore } from "./useMessageStore";
import toast from "react-hot-toast";

let pc = null;

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

      pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const socket = useAuthStore.getState().socket;
          if (socket) {
            socket.emit("sendIceCandidate", {
              targetId,
              candidate: event.candidate,
            });
          }
        }
      };

      pc.ontrack = (event) => {
        set({ remoteStream: event.streams[0] });
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const socket = useAuthStore.getState().socket;
      const authUser = useAuthStore.getState().authUser;
      if (socket && authUser) {
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
    } catch {
      toast.error("Could not access camera or microphone");
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

      pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const socket = useAuthStore.getState().socket;
          if (socket) {
            socket.emit("sendIceCandidate", {
              targetId,
              candidate: event.candidate,
            });
          }
        }
      };

      pc.ontrack = (event) => {
        set({ remoteStream: event.streams[0] });
      };

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit("acceptCall", { targetId, answer });
      }
    } catch {
      toast.error("Could not access camera or microphone");
      get().endCall();
    }
  },

  rejectIncomingCall: () => {
    const { targetId, callType } = get();
    const socket = useAuthStore.getState().socket;
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
    const socket = useAuthStore.getState().socket;
    if (socket && targetId) {
      socket.emit("disconnectCall", { targetId });
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    if (pc) {
      pc.close();
      pc = null;
    }

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
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micActive;
        set({ micActive: !micActive });
      }
    }
  },

  toggleCamera: () => {
    const { localStream, cameraActive } = get();
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraActive;
        set({ cameraActive: !cameraActive });
      }
    }
  },

  setupCallListeners: (socket) => {
    if (!socket) return;

    socket.off("incomingCall");
    socket.off("callAccepted");
    socket.off("receiveIceCandidate");
    socket.off("callEnded");

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
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("receiveIceCandidate", async ({ candidate }) => {
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("callEnded", () => {
      const { localStream } = get();
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (pc) {
        pc.close();
        pc = null;
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
      toast.error("Call ended");
    });
  },
}));
