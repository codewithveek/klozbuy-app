import "server-only";

import { db } from "@/db";
import { follows } from "@/db/schemas/users-schema"; // Need users for relations/counts
import { CreateFollowInput, Follow } from "@/models/follow.model";
import { eq, and } from "drizzle-orm";
// import { UserService } from "./user-service"; // Move this import inside methods

export class FollowService {
  /**
   * Establishes a follow relationship between two users.
   * Also increments followingCount for follower and followersCount for followed.
   * @param followData Object containing followerId and followingId.
   * @returns The created follow object.
   * @throws Error if the follow relationship already exists or creation fails.
   */
  static async createFollow(followData: CreateFollowInput): Promise<Follow> {
    const { followerId, followingId } = followData;

    if (followerId === followingId) {
      throw new Error("A user cannot follow themselves.");
    }

    // Check if the follow already exists
    const existingFollow = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ),
    });

    if (existingFollow) {
      throw new Error("Already following this user.");
    }

    // Ensure both users exist
    const { UserService } = await import("./user-service");
    const [followerUser, followingUser] = await Promise.all([
      UserService.getUserById(followerId),
      UserService.getUserById(followingId),
    ]);

    if (!followerUser) throw new Error("Follower user not found.");
    if (!followingUser) throw new Error("Following user not found.");

    const newFollow = await db.transaction(async (tx) => {
      const [returned] = await tx
        .insert(follows)
        .values(followData)
        .$returningId();

      return await tx.query.follows.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, returned.id);
        },
      });
    });

    if (!newFollow) {
      throw new Error("Failed to create follow relationship.");
    }

    // Update counts asynchronously (fire and forget, or handle errors for retry)
    UserService.incrementFollowingCount(followerId).catch(console.error);
    UserService.incrementFollowersCount(followingId).catch(console.error);

    return newFollow;
  }

  /**
   * Deletes a follow relationship (unfollow).
   * Also decrements followingCount for follower and followersCount for followed.
   * @param followerId The ID of the user initiating the unfollow.
   * @param followingId The ID of the user being unfollowed.
   * @returns True if deletion was successful, false otherwise.
   */
  static async deleteFollow(
    followerId: string,
    followingId: string
  ): Promise<boolean> {
    const [result] = await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );

    if (result.affectedRows > 0) {
      // Update counts asynchronously
      const { UserService } = await import("./user-service");
      UserService.decrementFollowingCount(followerId).catch(console.error);
      UserService.decrementFollowersCount(followingId).catch(console.error);
      return true;
    }
    return false;
  }

  /**
   * Retrieves all users that a specific user is following.
   * @param userId The ID of the user whose following list is requested.
   * @param limit Pagination limit.
   * @param offset Pagination offset.
   * @returns An array of users being followed.
   */
  static async getFollowing(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<any[]> {
    // Using 'any' for simplicity due to relations join, specify User type if only simple user data needed
    const result = await db.query.follows.findMany({
      where: eq(follows.followerId, userId),
      limit: limit,
      offset: offset,
      with: {
        following: true, // Eager load the 'following' user details
      },
      orderBy: follows.createdAt,
    });
    return result.map((f) => f.following); // Return just the user objects
  }

  /**
   * Retrieves all followers for a specific user.
   * @param userId The ID of the user whose followers list is requested.
   * @param limit Pagination limit.
   * @param offset Pagination offset.
   * @returns An array of users who are following the specified user.
   */
  static async getFollowers(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<any[]> {
    // Using 'any' for simplicity
    const result = await db.query.follows.findMany({
      where: eq(follows.followingId, userId),
      limit: limit,
      offset: offset,
      with: {
        follower: true, // Eager load the 'follower' user details
      },
      orderBy: follows.createdAt,
    });
    return result.map((f) => f.follower); // Return just the user objects
  }

  /**
   * Checks if one user is following another.
   * @param followerId The ID of the potential follower.
   * @param followingId The ID of the potential followed.
   * @returns True if followerId is following followingId, false otherwise.
   */
  static async isFollowing(
    followerId: string,
    followingId: string
  ): Promise<boolean> {
    const follow = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ),
    });
    return !!follow;
  }
}
