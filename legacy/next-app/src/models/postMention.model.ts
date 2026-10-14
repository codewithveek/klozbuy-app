import { postMentions } from "@/db/schemas/posts-schema"; // Adjusted path
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type PostMention = typeof postMentions.$inferSelect;
export type NewPostMention = typeof postMentions.$inferInsert;

export const CreatePostMentionSchema = createInsertSchema(postMentions, {
  postId: z.string().length(36, "Invalid post ID format."),
  mentionedUserId: z.string().length(36, "Invalid mentioned user ID format."),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const SelectPostMentionSchema = createSelectSchema(postMentions);

export type CreatePostMentionInput = z.infer<typeof CreatePostMentionSchema>;
export type PostMentionResponse = z.infer<typeof SelectPostMentionSchema>;
