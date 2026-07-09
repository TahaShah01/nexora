import type { Server } from "socket.io";

// Set once from server.ts after the Socket.io server is created, so
// services (which are imported before the server bootstraps) can emit
// without creating an import cycle back into server.ts.
let io: Server | null = null;

export function setIO(instance: Server) {
  io = instance;
}

export function getIO(): Server | null {
  return io;
}
