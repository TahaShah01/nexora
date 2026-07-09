import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

/** Lazily-created singleton — one WebSocket connection for the whole app, authenticated via the same accessToken cookie the REST API uses. */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5000", {
      withCredentials: true,
    });
  }
  return socket;
}
