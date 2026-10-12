import { posts } from "@/db/schemas/posts-schema"; // Adjusted path to your Drizzle schema file
import { UserResponseSchema } from "./users.model";
import { SelectLocationSchema } from "./location.model";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod/v4";

// Infer the Drizzle schema types for full post data
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// Zod schema for creating a new post (input validation)
export const CreatePostSchema = createInsertSchema(posts, {
  userId: z.string().length(36, "Invalid user ID format."),
  type: z.enum(posts.type.enumValues),
  content: z
    .string()
    .min(1, "Post content cannot be empty.")
    .max(65535, "Post content is too long.")
    .optional(), // text type max length
  status: z.enum(posts.status.enumValues).default("published"),
  visibility: z.enum(posts.visibility.enumValues).default("public"),
  locationId: z
    .string()
    .length(36, "Invalid location ID format.")
    .optional()
    .nullable(),
  publishedAt: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date
        ? new Date(arg)
        : undefined,
    z.date().optional()
  ),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isPromoted: true,
  likesCount: true,
  commentsCount: true,
  sharesCount: true,
  viewsCount: true,
});

// Zod schema for updating an existing post (input validation)
export const UpdatePostSchema = createUpdateSchema(posts, {
  id: z.string().length(36, "Invalid Post ID format.").optional(),
});

// Zod schema for selecting a post (output validation/typing)
export const SelectPostSchema = createSelectSchema(posts);

// Zod schema for a full post response including relations
export const PostResponseSchema = SelectPostSchema.extend({
  author: UserResponseSchema.optional(), // Assuming UserResponseSchema is defined
  location: SelectLocationSchema.optional(), // Use SelectLocationSchema for value
  // You might want to include nested schemas for comments, reactions, media, etc. here
  // comments: z.array(z.lazy(() => SelectPostCommentSchema)).optional(), // Requires PostCommentSchema
  // reactions: z.array(z.lazy(() => SelectPostReactionSchema)).optional(), // Requires PostReactionSchema
  // medias: z.array(z.lazy(() => SelectPostMediaSchema)).optional(), // Requires PostMediaSchema
}).omit({
  // Potentially omit internal fields for API response
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;
