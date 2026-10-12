import "server-only";
import { db } from "@/db";
import { users } from "@/db/schemas/users-schema"; // Adjust path to your Drizzle schema
import {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserResponseSchema,
} from "@/models/users.model";
import { eq, sql, and } from "drizzle-orm";

export class UserService {
  /**
   * Retrieves a user by their ID.
   * @param id The ID of the user.
   * @returns The user object or null if not found.
   */
  static async getUserById(id: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return user || null;
  }

  /**
   * Retrieves a user by their email.
   * @param email The email of the user.
   * @returns The user object or null if not found.
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user || null;
  }

  /**
   * Retrieves a user by their username.
   * @param username The username of the user.
   * @returns The user object or null if not found.
   */
  static async getUserByUsername(username: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    return user || null;
  }

  /**
   * Retrieves a user by their phone number.
   * @param phoneNumber The phone number of the user.
   * @returns The user object or null if not found.
   */
  static async getUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.phoneNumber, phoneNumber),
    });
    return user || null;
  }

  /**
   * Retrieves all users with optional pagination.
   * @param limit The maximum number of users to return.
   * @param offset The number of users to skip.
   * @returns An array of user objects.
   */
  static async getAllUsers(
    limit: number = 10,
    offset: number = 0
  ): Promise<User[]> {
    const allUsers = await db.query.users.findMany({
      limit: limit,
      offset: offset,
      orderBy: users.createdAt, // Order by creation date
    });
    return allUsers;
  }

  /**
   * Creates a new user.
   * @param userData The data for the new user.
   * @returns The created user object.
   */
  static async createUser(userData: CreateUserInput): Promise<User> {
    const newUser = await db.transaction(async (tx) => {
      const [returned] = await tx.insert(users).values(userData).$returningId();
      const user = await tx.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, returned.id);
        },
      });
      return user;
    });

    if (!newUser) {
      throw new Error("Failed to create user.");
    }
    return newUser;
  }

  /**
   * Updates an existing user.
   * @param id The ID of the user to update.
   * @param updateData The data to update.
   * @returns The updated user object or null if not found.
   */
  static async updateUser(
    id: string,
    updateData: UpdateUserInput
  ): Promise<User | null> {
    const updatedUser = await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ ...updateData, updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(users.id, id));

      const user = await tx.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, id);
        },
      });
      return user;
    });

    return updatedUser || null;
  }

  /**
   * Deletes a user by their ID.
   * @param id The ID of the user to delete.
   * @returns True if deletion was successful, false otherwise.
   */
  static async deleteUser(id: string): Promise<boolean> {
    const [result] = await db.delete(users).where(eq(users.id, id));
    return result.affectedRows > 0;
  }

  /**
   * Increments the followers count for a user.
   * @param userId The ID of the user whose followers count to increment.
   * @returns The updated user or null.
   */
  static async incrementFollowersCount(userId: string): Promise<User | null> {
    const updatedUser = await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          followersCount: sql`${users.followersCount} + 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(users.id, userId));
      const user = await tx.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, userId);
        },
      });
      return user;
    });
    return updatedUser || null;
  }

  /**
   * Decrements the followers count for a user.
   * @param userId The ID of the user whose followers count to decrement.
   * @returns The updated user or null.
   */
  static async decrementFollowersCount(userId: string): Promise<User | null> {
    const updatedUser = await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          followersCount: sql`${users.followersCount} - 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(and(eq(users.id, userId), sql`${users.followersCount} > 0`)); // Prevent negative counts
      const user = await tx.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, userId);
        },
      });
      return user;
    });
    return updatedUser || null;
  }

  /**
   * Increments the following count for a user.
   * @param userId The ID of the user whose following count to increment.
   * @returns The updated user or null.
   */
  static async incrementFollowingCount(userId: string): Promise<User | null> {
    const updatedUser = await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          followingCount: sql`${users.followingCount} + 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(users.id, userId));
      const user = await tx.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, userId);
        },
      });
      return user;
    });
    return updatedUser || null;
  }

  /**
   * Decrements the following count for a user.
   * @param userId The ID of the user whose following count to decrement.
   * @returns The updated user or null.
   */
  static async decrementFollowingCount(userId: string): Promise<User | null> {
    const updatedUser = await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          followingCount: sql`${users.followingCount} - 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(and(eq(users.id, userId), sql`${users.followingCount} > 0`)); // Prevent negative counts
      const user = await tx.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, userId);
        },
      });
      return user;
    });
    return updatedUser || null;
  }

  // Add more complex business logic here if needed, e.g., user search, profile analytics
}
