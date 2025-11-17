import { WebSocketServer } from "ws";
import type { Server, IncomingMessage, ServerResponse } from "http";
import { Authenticate } from "#middlewares/Socket/index";

// Setup function for WebSocket routes
export function setupWebSocket(
  server: Server<typeof IncomingMessage, typeof ServerResponse>
) {
  // Subscription route: /ws/subscribe
  const subscribe = new WebSocketServer({
    path: "/broadcast/subscribe",
    server,
  });

  // Messaging route: /ws/messages
  const message = new WebSocketServer({ path: "/broadcast/messages", server });

  subscribe.on("connection", (socket, req) => {
    Authenticate(req, socket);
  });

  message.on("connection", (socket, req) => {
    Authenticate(req, socket);
  });
}
