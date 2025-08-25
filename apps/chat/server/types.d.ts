// express.d.ts
import { z } from "zod";

declare module "express-serve-static-core" {
  interface Request {
    validatedQuery?: z.infer<z.ZodTypeAny>; // Extends Request with this optional property
  }
}
