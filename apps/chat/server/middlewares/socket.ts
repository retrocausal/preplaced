import type { Socket, ExtendedError } from 'socket.io';
import { authorize } from '#middlewares/auth';
import JWTParser from '#middlewares/decode';
import type { Request, Response, NextFunction } from 'express';

export function AttachId(
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
): string | void {
  const userId = socket.handshake.query?.userId as string;
  if (!userId) {
    throw new Error('No UserID to bind to');
  }
  socket.data.userId = userId;
  next();
}

export function WSAuth(socket: Socket, next: (err?: ExtendedError | undefined) => void) {
  const req = socket.request as Request;
  const res = {} as Response;
  try {
    authorize(req, res, () => {
      JWTParser(req, res, next as NextFunction);
    });
  } catch (err: unknown) {
    const e = err instanceof Error ? err : new Error('Unknown Auth error');
    next(e);
  }
}
