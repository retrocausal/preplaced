import express, { Express, Request, Response, NextFunction } from "express";
import responseTime from "response-time";
import { CustomException } from "#utils/exception";
import cookieParser from "cookie-parser";
import multer from "multer";
import "dotenv/config";
import routes from "#routes";
import { authorize } from "#middlewares/Auth";
import connection from "#db/db";
import config from "#config";
import JWTParser from "#middlewares/decode";
import { setupWebSocket, notifyWebSocketClients } from "#websocket";
import { extractPayload } from "#utils/jwt";

const app: Express = express();
const port: string = process.env.PORT!;
// Start listening and return the server instance for graceful shutdown
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  setupWebSocket(server); // Setup WebSocket in callback
});
connection
  .then(() => {
    console.log("MongoDB connected to chatdb");
    app.set("trust proxy", true);
    app.use(multer().any());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.COOKIE_SECRET as string));
    app.use(
      responseTime((req: Request, res: Response, time: number) => {
        console.log(`Response time for ${req.method} ${req.url}: ${time}ms`);
      })
    );
    app.use(/^(?!\/auth\/login).*/, authorize, JWTParser);
    app.get("/hello", (req: Request, res: Response) => {
      res.send(`Express server on port ${port} is up and running!`);
    });
    app.use(routes);
    app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
      console.error("Run time Error:", err);
      const status = (err as CustomException).statusCode || 500;
      if (
        (status === 401 || (req.path && req.path.match(/^\/auth\/logout.*/))) &&
        req.cookies?.chatUser
      ) {
        const payload = extractPayload(req.cookies.chatUser);
        const userId = payload.id;
        if (userId) {
          notifyWebSocketClients(userId); // Notify WebSocket clients
        }
        res.clearCookie("chatUser", { ...config.auth });
      }
      res
        .status(status)
        .json({
          message: (err as CustomException).message || "Internal server error",
        });
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
