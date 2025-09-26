// Import jsonwebtoken with types
import jwt, { SignOptions } from "jsonwebtoken";
import "dotenv/config";
import ms from "ms";

// Define payload type
export interface JwtPayload {
  id: string;
}

// Generate JWT token
export const generateToken = (userId: string): string => {
  const payload: JwtPayload = { id: userId };
  const options: SignOptions = {
    expiresIn: `${process.env.AUTH_TTL || 1}h` as ms.StringValue, // Use ms types for duration
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

// Verify JWT token
export const verifyToken = (token: string): JwtPayload | boolean => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch (error) {
    return false;
  }
  return decoded || false;
};

export const extractPayload = (token: string) => {
  const payload = jwt.decode(token);
  return payload as JwtPayload;
};
