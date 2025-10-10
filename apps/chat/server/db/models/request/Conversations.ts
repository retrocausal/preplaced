import { z } from "zod";

export const GetConversationsSchema = z.object({
  id: z.string({ error: "ID is required" }).nonempty("ID must be non-empty"),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be a positive integer")
    .optional()
    .default(10),
  page: z.coerce
    .number()
    .int()
    .min(1, "Page must be a positive integer")
    .optional()
    .default(1),
  cursor: z.coerce.number().optional().default(0),
});

export type GetConversationsReq = z.infer<typeof GetConversationsSchema>;
