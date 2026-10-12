import "server-only";
import { db } from "@/db";
import { posts } from "@/db/schemas/posts-schema"; // Adjusted paths
import { CreatePostInput, UpdatePostInput, Post } from "@/models/post.model";
import { eq, sql, and, desc, count } from "drizzle-orm";

export class PostService {
  /**
   * Retrieves a post by its ID, optionally with relations.
   * @param id The ID of the post.
   * @param withRelations Whether to include related data (author, location).
   * @returns The post object or null if not found.
   */
  static async getPostById(
    id: string,
    withRelations: boolean = false
  ): Promise<Post | null> {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: withRelations ? { author: true, location: true } : undefined,
    });
    return post || null;
  }

  /**
   * Retrieves all posts with optional filtering, pagination, and relations.
   * @param limit The maximum number of posts to return.
   * @param offset The number of posts to skip.
   * @param userId Optional: Filter by user ID.
   * @param type Optional: Filter by post type.
   * @param status Optional: Filter by post status.
   * @param visibility Optional: Filter by post visibility.
   * @param withRelations Whether to include related data (author, location).
   * @returns An array of post objects.
   */
  static async getAllPosts(
    limit: number = 10,
    offset: number = 0,
    userId?: string,
    type?: string,
    status?: string,
    visibility?: string,
    withRelations: boolean = false
  ): Promise<Post[]> {
    const whereClause = and(
      userId ? eq(posts.userId, userId) : undefined,
      type ? eq(posts.type, type as any) : undefined, // Cast to any due to Drizzle enum type inference
      status ? eq(posts.status, status as any) : undefined,
      visibility ? eq(posts.visibility, visibility as any) : undefined,
      eq(posts.status, "published") // Only retrieve published posts by default for public view
    );

    const allPosts = await db.query.posts.findMany({
      where: whereClause,
      limit: limit,
      offset: offset,
      orderBy: desc(posts.createdAt),
      with: withRelations ? { author: true, location: true } : undefined,
    });
    return allPosts;
  }

  /**
   * Creates a new post.
   * @param postData The data for the new post.
   * @returns The created post object.
   */
  static async createPost(postData: CreatePostInput): Promise<Post> {
    const newPost = await db.transaction(async (tx) => {
      const [returned] = await tx.insert(posts).values(postData).$returningId();
      return await tx.query.posts.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, returned.id);
        },
      });
    });
    if (!newPost) {
      throw new Error("Failed to create post.");
    }
    return newPost;
  }

  /**
   * Updates an existing post.
   * @param id The ID of the post to update.
   * @param updateData The data to update.
   * @returns The updated post object or null if not found.
   */
  static async updatePost(
    id: string,
    updateData: UpdatePostInput
  ): Promise<Post | null> {
    const updatedPost = await db.transaction(async (tx) => {
      await tx
        .update(posts)
        .set({ ...updateData, updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(posts.id, id));

      return await tx.query.posts.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, id);
        },
      });
    });
    return updatedPost || null;
  }

  /**
   * Deletes a post by its ID.
   * @param id The ID of the post to delete.
   * @returns True if deletion was successful, false otherwise.
   */
  static async deletePost(id: string): Promise<boolean> {
    const [result] = await db.delete(posts).where(eq(posts.id, id));

    return result.affectedRows > 0;
  }

  /**
   * Increments the likes count for a post.
   * @param postId The ID of the post.
   * @returns The updated post or null.
   */
  static async incrementLikesCount(postId: string): Promise<Post | null> {
    const updatedPost = await db.transaction(async (tx) => {
      await tx
        .update(posts)
        .set({
          likesCount: sql`${posts.likesCount} + 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(posts.id, postId));

      return await tx.query.posts.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, postId);
        },
      });
    });
    return updatedPost || null;
  }

  /**
   * Decrements the likes count for a post.
   * @param postId The ID of the post.
   * @returns The updated post or null.
   */
  static async decrementLikesCount(postId: string): Promise<Post | null> {
    const updatedPost = await db.transaction(async (tx) => {
      await tx
        .update(posts)
        .set({
          likesCount: sql`${posts.likesCount} - 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(and(eq(posts.id, postId), sql`${posts.likesCount} > 0`));

      return await tx.query.posts.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, postId);
        },
      });
    });
    return updatedPost || null;
  }

  /**
   * Increments the comments count for a post.
   * @param postId The ID of the post.
   * @returns The updated post or null.
   */
  static async incrementCommentsCount(postId: string): Promise<Post | null> {
    const updatedPost = await db.transaction(async (tx) => {
      await tx
        .update(posts)
        .set({
          commentsCount: sql`${posts.commentsCount} + 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(posts.id, postId));

      return await tx.query.posts.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, postId);
        },
      });
    });
    return updatedPost || null;
  }

  /**
   * Decrements the comments count for a post.
   * @param postId The ID of the post.
   * @returns The updated post or null.
   */
  static async decrementCommentsCount(postId: string): Promise<Post | null> {
    const updatedPost = await db.transaction(async (tx) => {
      await tx
        .update(posts)
        .set({
          commentsCount: sql`${posts.commentsCount} - 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(and(eq(posts.id, postId), sql`${posts.commentsCount} > 0`));

      return await tx.query.posts.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, postId);
        },
      });
    });
    return updatedPost || null;
  }

  /**
   * Increments the shares count for a post.
   * @param postId The ID of the post.
   * @returns The updated post or null.
   */
  static async incrementSharesCount(postId: string): Promise<Post | null> {
    const updatedPost = await db.transaction(async (tx) => {
      await tx
        .update(posts)
        .set({
          sharesCount: sql`${posts.sharesCount} + 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(posts.id, postId));

      return await tx.query.posts.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, postId);
        },
      });
    });
    return updatedPost || null;
  }

  /**
   * Increments the views count for a post.
   * @param postId The ID of the post.
   * @returns The updated post or null.
   */
  static async incrementViewsCount(postId: string): Promise<Post | null> {
    const updatedPost = await db.transaction(async (tx) => {
      await tx
        .update(posts)
        .set({
          viewsCount: sql`${posts.viewsCount} + 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(posts.id, postId));

      return await tx.query.posts.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, postId);
        },
      });
    });
    return updatedPost || null;
  }

  // Add more specific post-related logic here, e.g., search, trending posts
}
