import { Request, Response, NextFunction } from 'express';
import { CustomException } from '#utils/exception';
import { GetConversationsSchema } from '#definitions/request/conversations';
import { ZodError } from 'zod';

export const validateFetchConversationsQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedQuery = GetConversationsSchema.parse(req.query);
    req.validatedQuery = validatedQuery; // Add validated data to a new property
    next();
  } catch (error: unknown) {
    console.log((error as ZodError).issues);
    const message =
      error instanceof ZodError
        ? error.issues[0].message
        : (error as Error | CustomException).message || 'Invalid query parameters';
    next(new CustomException(message, 400));
  }
};
