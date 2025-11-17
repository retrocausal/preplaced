import { Request } from "express";
import { WebSocket } from "ws";
import type { IncomingMessage } from "http";

export function Authenticate(
  req: IncomingMessage,
  socket: WebSocket
): string | void {
  const request = req as Request;
  const userId = request.query?.userId as string;
  if (!userId) {
    socket.send(JSON.stringify({ error: "Unauthorized" }));
    socket.close();
    return;
  }
  return userId;
}
