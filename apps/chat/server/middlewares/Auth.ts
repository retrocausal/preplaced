// Import types and modules
import { Request, Response, NextFunction } from "express";
import User from "#models/User";
import { verifyToken } from "#utils/jwt";
import { CustomException } from "#utils/exception";
import config from "#config";

// Login handler
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };
  if (!username || !password) {
    throw new CustomException("Username and password are required", 400);
  }
  const user = await User.findOne({ username });
  const valid = await user?.validateUser(password || "");
  if (!user || !valid) {
    const message = !user ? `Invalid Username ${username}` : "Invalid Password";
    throw new CustomException(message, 401);
  }
  res.cookie("chatUser", user.generateAuthToken(), { ...config.auth });
  res.status(200).json({
    username: user.username,
    displayName: user.displayName,
    chatCount: user.chatCount || 0,
  });
};

// Logout handler
export const logout = (req: Request, res: Response, next: NextFunction) => {
  if (req.signedCookies.chatUser) {
    res.clearCookie("chatUser", { ...config.auth });
  } else {
    throw new CustomException("Invalid Session", 400);
  }
  res.status(200).json({});
};

// Authorize middleware
export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const { signedCookies } = req;
  const { chatUser } = signedCookies;
  if (!chatUser || !verifyToken(chatUser)) {
    throw new CustomException("Invalid Session", 401);
  }
  next();
};
