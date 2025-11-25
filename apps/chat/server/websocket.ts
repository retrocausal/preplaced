import { Server as SocketIOServer } from "socket.io";
import type {
  Server as HTTPServer,
  IncomingMessage,
  ServerResponse,
} from "http";
import { AttachId, WSAuth } from "#middlewares/Socket/index";

// Setup function for Socket.IO namespaces
export function setupWebSocket(
  server: HTTPServer<typeof IncomingMessage, typeof ServerResponse>
) {
  const io = new SocketIOServer(server, {
    path: "/broadcast", // Base path for all namespaces
  });
  // Apply global middlewares
  io.use(WSAuth);
  io.use(AttachId);

  // Subscription namespace: /broadcast/subscribe
  const subscribe = io.of("/subscribe");
  subscribe.on("connection", (socket) => {});

  // Messaging namespace: /broadcast/messages
  const message = io.of("/messages");
  message.on("connection", (socket) => {});
}
