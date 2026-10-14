import { follows } from "@/db/schemas/users-schema"; // Adjusted path
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type Follow = typeof follows.$inferSelect;
export type NewFollow = typeof follows.$inferInsert;

export const CreateFollowSchema = createInsertSchema(follows, {
  followerId: z.string().length(36, "Invalid follower ID format."),
  followingId: z.string().length(36, "Invalid following ID format."),
}).omit({
  id: true,
  createdAt: true,
});

export const SelectFollowSchema = createSelectSchema(follows);

export type CreateFollowInput = z.infer<typeof CreateFollowSchema>;
export type FollowResponse = z.infer<typeof SelectFollowSchema>;
