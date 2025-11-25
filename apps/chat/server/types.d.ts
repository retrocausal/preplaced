// express.d.ts
import { z } from "zod";

import "socket.io";

declare module "socket.io" {
  interface Socket {
    data: Record<string, string>;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    validatedQuery?: z.infer<z.ZodTypeAny>; // Extends Request with this optional property
  }
}
