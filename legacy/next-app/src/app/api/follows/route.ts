import { NextRequest } from "next/server";
import { FollowController } from "@/controllers/follow.controller";

/**
 * Handles POST requests to create a new follow relationship.
 * Request body should contain { followerId: string, followingId: string }.
 * @param request The NextRequest object.
 * @returns A JSON response with the created follow data or an error.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return await FollowController.createFollow(body);
  } catch (error) {
    console.error("Failed to parse request body for follow creation:", error);
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Handles DELETE requests to remove a follow relationship (unfollow).
 * Request body should contain { followerId: string, followingId: string }.
 * @param request The NextRequest object.
 * @returns A JSON response indicating success or an error.
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json(); // DELETE with body requires specific handling in Next.js, or use a custom header/query params.
    // For simplicity here, assuming body can be read. For strict REST, this is often a POST with method override or specific unfollow endpoint.
    return await FollowController.deleteFollow(body);
  } catch (error) {
    console.error("Failed to parse request body for follow deletion:", error);
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
