// Import types and modules
import { Request, Response, NextFunction } from "express";
import User from "#models/User";
import { generateToken, verifyToken } from "#utils/jwt";
import { CustomException } from "#utils/exception";

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
    throw new CustomException(
      `Invalid Username or password for ${username}`,
      401
    );
  }

  res.cookie("chatUser", generateToken(username), {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    signed: true,
  });
  res.status(200).json({ username: user.username });
};

// Logout handler
export const logout = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.signedCookies);

  if (req.signedCookies.chatUser) {
    res.clearCookie("chatUser", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      signed: true,
    });
    res.status(200).json({});
  } else res.status(400).json({});
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
