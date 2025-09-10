import { Request, Response, NextFunction } from "express";
import { extractPayload, JwtPayload } from "#utils/jwt";

export default (req: Request, res: Response, next: NextFunction) => {
  const { signedCookies } = req;
  const { chatUser } = signedCookies;
  const { id }: JwtPayload = extractPayload(chatUser);
  Object.defineProperty(req, "query", {
    ...Object.getOwnPropertyDescriptor(req, "query"),
    value: req.query,
    writable: true,
  });
  req.query["userId"] = id;
  Object.defineProperty(req, "query", {
    ...Object.getOwnPropertyDescriptor(req, "query"),
    value: req.query,
    writable: false,
  });
  next();
};
