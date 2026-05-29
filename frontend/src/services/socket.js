import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

let socketInstance = null;

export const socketService = {
  connect: (userId) => {
    if (socketInstance) return socketInstance;
    socketInstance = io(BASE_URL, {
      query: { userId },
    });
    return socketInstance;
  },
  
  disconnect: () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
  },
  
  getSocket: () => socketInstance,
};
export default socketService;
