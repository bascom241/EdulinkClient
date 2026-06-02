import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return apiUrl.replace(/\/api\/v1\/?$/, "");
};

export const getLiveSocket = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) return null;

  if (!socket) {
    socket = io(getSocketUrl(), {
      auth: { token },
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};

export const disconnectLiveSocket = () => {
  socket?.disconnect();
  socket = null;
};
