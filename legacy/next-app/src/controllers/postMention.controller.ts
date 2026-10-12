import {
  CreatePostMentionInput,
  CreatePostMentionSchema,
  PostMentionResponse,
  SelectPostMentionSchema,
} from "@/models/postMention.model";
import { PostMentionService } from "@/services/postMention.service";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod/v4";

export class PostMentionController {
  /**
   * Handles fetching a post mention by ID.
   * @param id The post mention ID from the request params.
   * @returns A NextApiResponse with the post mention data or an error.
   */
  static async getPostMentionById(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json(
          { error: "Post mention ID is required." },
          { status: 400 }
        );
      }

      const mention = await PostMentionService.getPostMentionById(id);

      if (!mention) {
        return NextResponse.json(
          { error: "Post mention not found." },
          { status: 404 }
        );
      }

      const validatedMention = SelectPostMentionSchema.safeParse(mention);
      if (!validatedMention.success) {
        console.error(
          "Post mention data validation failed for ID:",
          id,
          validatedMention.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid post mention data." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedMention.data, { status: 200 });
    } catch (error) {
      console.error("Error fetching post mention by ID:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles fetching all mentions for a specific post.
   * @param searchParams URLSearchParams containing postId.
   * @returns A NextApiResponse with an array of post mention data.
   */
  static async getMentionsByPostId(
    searchParams: URLSearchParams
  ): Promise<NextResponse> {
    try {
      const postId = searchParams.get("postId");

      if (!postId) {
        return NextResponse.json(
          { error: "Post ID is required to fetch mentions." },
          { status: 400 }
        );
      }

      const mentions = await PostMentionService.getMentionsByPostId(postId);

      const validatedMentions = z
        .array(SelectPostMentionSchema)
        .safeParse(mentions);
      if (!validatedMentions.success) {
        console.error(
          "Multiple post mention data validation failed:",
          validatedMentions.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid post mention data found." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedMentions.data, { status: 200 });
    } catch (error) {
      console.error("Error fetching post mentions by post ID:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles creating a new post mention.
   * @param requestBody The request body containing post mention data.
   * @returns A NextApiResponse with the created post mention data or an error.
   */
  static async createPostMention(
    requestBody: CreatePostMentionInput
  ): Promise<NextResponse> {
    try {
      const validatedData = CreatePostMentionSchema.parse(requestBody);

      const newMention = await PostMentionService.createPostMention(
        validatedData
      );

      const validatedMention = SelectPostMentionSchema.safeParse(newMention);
      if (!validatedMention.success) {
        console.error(
          "Created post mention data validation failed:",
          validatedMention.error
        );
        return NextResponse.json(
          {
            error: "Internal server error: Invalid created post mention data.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedMention.data, { status: 201 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error creating post mention:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles deleting a post mention.
   * @param id The post mention ID from the request params.
   * @returns A NextApiResponse with a success message or an error.
   */
  static async deletePostMention(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json(
          { error: "Post mention ID is required." },
          { status: 400 }
        );
      }

      const deleted = await PostMentionService.deletePostMention(id);

      if (!deleted) {
        return NextResponse.json(
          { error: "Post mention not found or could not be deleted." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Post mention deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting post mention:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }
}
