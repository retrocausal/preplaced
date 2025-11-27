// Import types and modules
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '#utils/jwt';
import { CustomException } from '#utils/exception';
// Authorize middleware
export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const { signedCookies } = req;
  const { chatUser } = signedCookies;
  if (!chatUser || !verifyToken(chatUser)) {
    throw new CustomException('Invalid Session', 401);
  }
  next();
};
