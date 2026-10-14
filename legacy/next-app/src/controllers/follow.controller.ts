import { CreateFollowInput, CreateFollowSchema } from "@/models/follow.model";
import { FollowService } from "@/services/follow.service";
import { NextResponse } from "next/server";
import { ZodError } from "zod/v4";

export class FollowController {
  /**
   * Handles creating a new follow relationship.
   * @param requestBody Contains followerId and followingId.
   * @returns A JSON response with the created follow object or an error.
   */
  static async createFollow(
    requestBody: CreateFollowInput
  ): Promise<NextResponse> {
    try {
      const validatedData = CreateFollowSchema.parse(requestBody);
      const newFollow = await FollowService.createFollow(validatedData);
      return NextResponse.json(newFollow, { status: 201 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error creating follow:", error);
      // Specific error messages for common follow errors
      if (
        error instanceof Error &&
        (error.message.includes("Already following") ||
          error.message.includes("cannot follow themselves"))
      ) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
      if (error instanceof Error && error.message.includes("user not found")) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles deleting a follow relationship (unfollow).
   * @param requestBody Contains followerId and followingId.
   * @returns A JSON response indicating success or an error.
   */
  static async deleteFollow(requestBody: {
    followerId: string;
    followingId: string;
  }): Promise<NextResponse> {
    try {
      const { followerId, followingId } = requestBody;
      if (!followerId || !followingId) {
        return NextResponse.json(
          { error: "Follower ID and Following ID are required." },
          { status: 400 }
        );
      }

      const deleted = await FollowService.deleteFollow(followerId, followingId);
      if (!deleted) {
        return NextResponse.json(
          { error: "Follow relationship not found or could not be deleted." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Unfollowed successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting follow:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles retrieving users a specific user is following.
   * @param userId The ID of the user.
   * @param searchParams URLSearchParams for limit and offset.
   * @returns A JSON response with an array of users or an error.
   */
  static async getFollowing(
    userId: string,
    searchParams: URLSearchParams
  ): Promise<NextResponse> {
    try {
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required." },
          { status: 400 }
        );
      }
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const offset = parseInt(searchParams.get("offset") || "0", 10);

      const followingUsers = await FollowService.getFollowing(
        userId,
        limit,
        offset
      );
      return NextResponse.json(followingUsers, { status: 200 });
    } catch (error) {
      console.error("Error fetching following users:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles retrieving followers for a specific user.
   * @param userId The ID of the user.
   * @param searchParams URLSearchParams for limit and offset.
   * @returns A JSON response with an array of users or an error.
   */
  static async getFollowers(
    userId: string,
    searchParams: URLSearchParams
  ): Promise<NextResponse> {
    try {
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required." },
          { status: 400 }
        );
      }
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const offset = parseInt(searchParams.get("offset") || "0", 10);

      const followers = await FollowService.getFollowers(userId, limit, offset);
      return NextResponse.json(followers, { status: 200 });
    } catch (error) {
      console.error("Error fetching followers:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }
}
