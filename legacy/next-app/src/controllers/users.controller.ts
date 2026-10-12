import {
  CreateUserInput,
  UpdateUserInput,
  CreateUserSchema,
  UpdateUserSchema,
  UserResponseSchema,
  UserResponse,
} from "@/models/users.model";
import { UserService } from "@/services/user-service";
import { NextResponse } from "next/server";
import { ZodError, z, ZodType } from "zod/v4";

export class UserController {
  /**
   * Handles fetching a user by ID.
   * @param id The user ID from the request params.
   * @returns A NextApiResponse with the user data or an error.
   */
  static async getUserById(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json(
          { error: "User ID is required." },
          { status: 400 }
        );
      }

      const user = await UserService.getUserById(id);

      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      const validatedUser = UserResponseSchema.safeParse(user);
      if (!validatedUser.success) {
        // Log this internally as a schema mismatch in DB vs. Zod
        console.error("User data validation failed:", validatedUser.error);
        return NextResponse.json(
          { error: "Internal server error: Invalid user data." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedUser.data, { status: 200 });
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles fetching all users.
   * @param searchParams URLSearchParams for limit and offset.
   * @returns A NextApiResponse with an array of user data.
   */
  static async getAllUsers(
    searchParams: URLSearchParams
  ): Promise<NextResponse> {
    try {
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const offset = parseInt(searchParams.get("offset") || "0", 10);

      if (isNaN(limit) || limit <= 0 || isNaN(offset) || offset < 0) {
        return NextResponse.json(
          { error: "Invalid limit or offset parameters." },
          { status: 400 }
        );
      }

      const users = await UserService.getAllUsers(limit, offset);

      // Ensure UserResponseSchema is a ZodType
      const validatedUsers = z.array(UserResponseSchema).safeParse(users);
      if (!validatedUsers.success) {
        console.error(
          "Multiple user data validation failed:",
          validatedUsers.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid user data found." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedUsers.data, { status: 200 });
    } catch (error) {
      console.error("Error fetching all users:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles creating a new user.
   * @param requestBody The request body containing user data.
   * @returns A NextApiResponse with the created user data or an error.
   */
  static async createUser(requestBody: CreateUserInput): Promise<NextResponse> {
    try {
      const validatedData = CreateUserSchema.parse(requestBody);

      // Check for existing user by email or username
      if (validatedData.email) {
        const existingUserByEmail = await UserService.getUserByEmail(
          validatedData.email
        );
        if (existingUserByEmail) {
          return NextResponse.json(
            { error: "User with this email already exists." },
            { status: 409 }
          );
        }
      }
      if (validatedData.username) {
        const existingUserByUsername = await UserService.getUserByUsername(
          validatedData.username
        );
        if (existingUserByUsername) {
          return NextResponse.json(
            { error: "User with this username already exists." },
            { status: 409 }
          );
        }
      }
      // Add similar check for phone number if it should be unique
      if (validatedData.phoneNumber) {
        const existingUserByPhone = await UserService.getUserByPhoneNumber(
          validatedData.phoneNumber
        );
        if (existingUserByPhone) {
          return NextResponse.json(
            { error: "User with this phone number already exists." },
            { status: 409 }
          );
        }
      }

      const newUser = await UserService.createUser(validatedData);

      const validatedUser = UserResponseSchema.safeParse(newUser);
      if (!validatedUser.success) {
        console.error(
          "Created user data validation failed:",
          validatedUser.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid created user data." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedUser.data, { status: 201 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error creating user:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles updating an existing user.
   * @param id The user ID from the request params.
   * @param requestBody The request body containing update data.
   * @returns A NextApiResponse with the updated user data or an error.
   */
  static async updateUser(
    id: string,
    requestBody: UpdateUserInput
  ): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json(
          { error: "User ID is required." },
          { status: 400 }
        );
      }

      const validatedData = UpdateUserSchema.parse(requestBody);

      const updatedUser = await UserService.updateUser(id, validatedData);

      if (!updatedUser) {
        return NextResponse.json(
          { error: "User not found or nothing to update." },
          { status: 404 }
        );
      }

      const validatedUser = UserResponseSchema.safeParse(updatedUser);
      if (!validatedUser.success) {
        console.error(
          "Updated user data validation failed:",
          validatedUser.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid updated user data." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedUser.data, { status: 200 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles deleting a user.
   * @param id The user ID from the request params.
   * @returns A NextApiResponse with a success message or an error.
   */
  static async deleteUser(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json(
          { error: "User ID is required." },
          { status: 400 }
        );
      }

      const deleted = await UserService.deleteUser(id);

      if (!deleted) {
        return NextResponse.json(
          { error: "User not found or could not be deleted." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "User deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }
}
