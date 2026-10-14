import { NextRequest } from "next/server";
import { UserController } from "@/controllers/users.controller"; // Adjust path

/**
 * Handles GET requests to retrieve all users.
 * @param request The NextRequest object.
 * @returns A JSON response with user data or an error.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  return await UserController.getAllUsers(searchParams);
}

/**
 * Handles POST requests to create a new user.
 * @param request The NextRequest object.
 * @returns A JSON response with the created user data or an error.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return await UserController.createUser(body);
  } catch (error) {
    console.error("Failed to parse request body for user creation:", error);
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
