import { z } from "zod";

export const chatListRequestSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be a positive integer")
    .optional()
    .default(10),
  page: z
    .number()
    .int()
    .min(1, "Page must be a positive integer")
    .optional()
    .default(1),
  lazy: z.boolean().optional().default(false),
});

export type ChatListRequest = z.infer<typeof chatListRequestSchema>;
