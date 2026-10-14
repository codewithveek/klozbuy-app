import "server-only";
import { db } from "@/db";
import { postMentions } from "@/db/schemas/posts-schema"; // Adjusted path
import {
  CreatePostMentionInput,
  PostMention,
} from "@/models/postMention.model";
import { eq, and } from "drizzle-orm";

export class PostMentionService {
  static async getPostMentionById(id: string): Promise<PostMention | null> {
    const mention = await db.query.postMentions.findFirst({
      where: eq(postMentions.id, id),
    });
    return mention || null;
  }
  static async createPostMention(
    input: CreatePostMentionInput
  ): Promise<PostMention | null> {
    const mention = await db.transaction(async (tx) => {
      const [returned] = await tx
        .insert(postMentions)
        .values(input)
        .$returningId();

      return await tx.query.postMentions.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, returned.id);
        },
      });
    });
    return mention || null;
  }
  static async getMentionsByPostId(postId: string): Promise<PostMention[]> {
    return db.query.postMentions.findMany({
      where: eq(postMentions.postId, postId),
    });
  }
  static async deletePostMention(id: string): Promise<boolean> {
    const result = await db.delete(postMentions).where(eq(postMentions.id, id));
    return result[0].affectedRows > 0;
  }
  // Add more methods as needed, e.g., getMentionsByPostId, createPostMention, etc.
}
