import type { CookieOptions } from "express";
export default {
  auth: {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    signed: true,
  },
} as { auth: CookieOptions };
