import socketService from "./socket";

let pc = null;

export const webrtcService = {
  createPeerConnection: (targetId, localStream, onRemoteStream) => {
    if (pc) {
      webrtcService.closeConnection();
    }

    pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = socketService.getSocket();
        if (socket) {
          socket.emit("sendIceCandidate", {
            targetId,
            candidate: event.candidate,
          });
        }
      }
    };

    pc.ontrack = (event) => {
      if (onRemoteStream && event.streams[0]) {
        onRemoteStream(event.streams[0]);
      }
    };

    return pc;
  },

  createOffer: async () => {
    if (!pc) return null;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  },

  createAnswer: async (offer) => {
    if (!pc) return null;
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  },

  setRemoteDescription: async (answer) => {
    if (pc && answer) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  },

  addIceCandidate: async (candidate) => {
    if (pc && candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  },

  closeConnection: () => {
    if (pc) {
      pc.close();
      pc = null;
    }
  },

  toggleTrack: (stream, type, enabled) => {
    if (stream) {
      const track =
        type === "audio"
          ? stream.getAudioTracks()[0]
          : stream.getVideoTracks()[0];
      if (track) {
        track.enabled = enabled;
      }
    }
  },

  getPeerConnection: () => pc,
};

export default webrtcService;
