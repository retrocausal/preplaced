import express, { Express, Request, Response, NextFunction } from "express";
import responseTime from "response-time";
import { CustomException } from "#utils/exception";
import cookieParser from "cookie-parser";
import multer from "multer";
import "dotenv/config";
import routes from "#routes";
import { authorize } from "#middlewares/Auth";
import connection from "#db/db";

const app: Express = express();
connection
  .then(() => {
    console.log("MongoDB connected to chatdb");
    const port: string = process.env.PORT!;
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
    app.use(/^(?!\/auth\/login).*/, authorize);
    app.get("/hello", (req: Request, res: Response) => {
      res.send(`Express server on port ${port} is up and running!`);
    });
    app.use(routes);
    app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
      console.error("Run time Error:", err);
      if (
        (err as CustomException).statusCode &&
        (err as CustomException).statusCode === 401
      ) {
        res.clearCookie("chatUser", {
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          signed: true,
        });
        res.status(301).location("/login").end();
      } else
        res
          .status((err as CustomException).statusCode || 500)
          .json({ message: (err as CustomException).message });
    });

    // Start listening and return the server instance for graceful shutdown
    const server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });

    // Handle nodemon restart signal (SIGUSR2) for graceful shutdown
    process.on("SIGUSR2", () => {
      console.log(`SIGUSR2 received on port ${port}, shutting down gracefully`);
      server.close(() => {
        console.log(`Server on port ${port} closed`);
        process.kill(process.pid, "SIGUSR2"); // Signal nodemon to proceed with restart
      });
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
