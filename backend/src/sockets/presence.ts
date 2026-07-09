// In-memory online-presence tracking, keyed by userId -> set of socket IDs
// (a user can have multiple tabs/devices open). Single-process only — a
// horizontally-scaled deployment would need a shared store (e.g. Redis)
// instead; out of scope for this phase.
const onlineUsers = new Map<string, Set<string>>();

export function markOnline(userId: string, socketId: string) {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId)!.add(socketId);
}

export function markOffline(userId: string, socketId: string) {
  const sockets = onlineUsers.get(userId);
  sockets?.delete(socketId);
  if (sockets && sockets.size === 0) onlineUsers.delete(userId);
}

export function isOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}
