import {
  CreatePostInput,
  UpdatePostInput,
  CreatePostSchema,
  UpdatePostSchema,
  PostResponseSchema,
} from "@/models/post.model";
import { PostService } from "@/services/post.service";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod/v4";

export class PostController {
  /**
   * Handles fetching a post by ID.
   * @param id The post ID from the request params.
   * @returns A NextApiResponse with the post data or an error.
   */
  static async getPostById(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json(
          { error: "Post ID is required." },
          { status: 400 }
        );
      }

      const post = await PostService.getPostById(id, true); // Include relations

      if (!post) {
        return NextResponse.json({ error: "Post not found." }, { status: 404 });
      }

      const validatedPost = PostResponseSchema.safeParse(post);
      if (!validatedPost.success) {
        console.error(
          "Post data validation failed for ID:",
          id,
          validatedPost.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid post data." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedPost.data, { status: 200 });
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles fetching all posts.
   * @param searchParams URLSearchParams for filtering and pagination.
   * @returns A NextApiResponse with an array of post data.
   */
  static async getAllPosts(
    searchParams: URLSearchParams
  ): Promise<NextResponse> {
    try {
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const offset = parseInt(searchParams.get("offset") || "0", 10);
      const userId = searchParams.get("userId") || undefined;
      const type = searchParams.get("type") || undefined;
      const status = searchParams.get("status") || undefined; // Admin/Moderator might use this
      const visibility = searchParams.get("visibility") || undefined;

      if (isNaN(limit) || limit <= 0 || isNaN(offset) || offset < 0) {
        return NextResponse.json(
          { error: "Invalid limit or offset parameters." },
          { status: 400 }
        );
      }

      const posts = await PostService.getAllPosts(
        limit,
        offset,
        userId,
        type,
        status,
        visibility,
        true
      );

      const validatedPosts = z.array(PostResponseSchema).safeParse(posts);
      if (!validatedPosts.success) {
        console.error(
          "Multiple post data validation failed:",
          validatedPosts.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid post data found." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedPosts.data, { status: 200 });
    } catch (error) {
      console.error("Error fetching all posts:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles creating a new post.
   * @param requestBody The request body containing post data.
   * @returns A NextApiResponse with the created post data or an error.
   */
  static async createPost(requestBody: CreatePostInput): Promise<NextResponse> {
    try {
      const validatedData = CreatePostSchema.parse(requestBody);

      const newPost = await PostService.createPost(validatedData);

      const validatedPost = PostResponseSchema.safeParse(newPost);
      if (!validatedPost.success) {
        console.error(
          "Created post data validation failed:",
          validatedPost.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid created post data." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedPost.data, { status: 201 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error creating post:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles updating an existing post.
   * @param id The post ID from the request params.
   * @param requestBody The request body containing update data.
   * @returns A NextApiResponse with the updated post data or an error.
   */
  static async updatePost(
    id: string,
    requestBody: UpdatePostInput
  ): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json(
          { error: "Post ID is required." },
          { status: 400 }
        );
      }

      const validatedData = UpdatePostSchema.parse(requestBody);

      const updatedPost = await PostService.updatePost(id, validatedData);

      if (!updatedPost) {
        return NextResponse.json(
          { error: "Post not found or nothing to update." },
          { status: 404 }
        );
      }

      const validatedPost = PostResponseSchema.safeParse(updatedPost);
      if (!validatedPost.success) {
        console.error(
          "Updated post data validation failed:",
          validatedPost.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid updated post data." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedPost.data, { status: 200 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error updating post:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles deleting a post.
   * @param id The post ID from the request params.
   * @returns A NextApiResponse with a success message or an error.
   */
  static async deletePost(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json(
          { error: "Post ID is required." },
          { status: 400 }
        );
      }

      const deleted = await PostService.deletePost(id);

      if (!deleted) {
        return NextResponse.json(
          { error: "Post not found or could not be deleted." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Post deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting post:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }
}
