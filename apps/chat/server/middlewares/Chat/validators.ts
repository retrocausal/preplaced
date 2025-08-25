// validateChatQuery.ts
import { Request, Response, NextFunction } from "express";
import { CustomException } from "#utils/exception";
import { chatListRequestSchema } from "#models/request/Chat";
import { ZodError } from "zod";

export const validateChatQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedQuery = chatListRequestSchema.parse(req.query);
    req.validatedQuery = validatedQuery; // Add validated data to a new property
    next();
  } catch (error: unknown) {
    const message =
      error instanceof ZodError
        ? error.issues[0].message
        : (error as Error | CustomException).message ||
          "Invalid query parameters";
    next(new CustomException(message, 400));
  }
};
