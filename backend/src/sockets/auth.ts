import type { Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt";
import type { UserRole } from "../models/User.model";

function parseCookies(header?: string): Record<string, string> {
  if (!header) return {};
  return header.split(";").reduce((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (key) acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {} as Record<string, string>);
}

/** Authenticates a socket using the same accessToken cookie the REST API uses. */
export function authenticateSocket(socket: Socket): { id: string; role: UserRole } | null {
  const cookies = parseCookies(socket.handshake.headers.cookie);
  const token = cookies.accessToken;
  if (!token) return null;
  try {
    const payload = verifyAccessToken(token);
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}
