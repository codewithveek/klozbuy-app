import { NextRequest } from "next/server";
import { PostController } from "@/controllers/post.controller"; // Adjust path

/**
 * Handles GET requests to retrieve all posts.
 * @param request The NextRequest object.
 * @returns A JSON response with post data or an error.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  return await PostController.getAllPosts(searchParams);
}

/**
 * Handles POST requests to create a new post.
 * @param request The NextRequest object.
 * @returns A JSON response with the created post data or an error.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return await PostController.createPost(body);
  } catch (error) {
    console.error("Failed to parse request body for post creation:", error);
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
