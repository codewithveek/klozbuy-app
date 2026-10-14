import { NextRequest } from "next/server";
import { PostMentionController } from "@/controllers/postMention.controller"; // Adjust path

/**
 * Handles GET requests to retrieve post mentions, primarily filtered by postId.
 * @param request The NextRequest object.
 * @returns A JSON response with post mention data or an error.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  return await PostMentionController.getMentionsByPostId(searchParams);
}

/**
 * Handles POST requests to create a new post mention.
 * @param request The NextRequest object.
 * @returns A JSON response with the created post mention data or an error.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return await PostMentionController.createPostMention(body);
  } catch (error) {
    console.error(
      "Failed to parse request body for post mention creation:",
      error
    );
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
