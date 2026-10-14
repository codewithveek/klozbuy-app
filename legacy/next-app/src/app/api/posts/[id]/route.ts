import { NextRequest } from "next/server";
import { PostController } from "@/controllers/post.controller"; // Adjust path

// Define params type for route handlers
interface PostRouteParams {
  params: {
    id: string;
  };
}

/**
 * Handles GET requests to retrieve a single post by ID.
 * @param request The NextRequest object.
 * @param params The route parameters containing the post ID.
 * @returns A JSON response with post data or an error.
 */
export async function GET(request: NextRequest, { params }: PostRouteParams) {
  return await PostController.getPostById(params.id);
}

/**
 * Handles PUT requests to update an existing post by ID.
 * @param request The NextRequest object.
 * @param params The route parameters containing the post ID.
 * @returns A JSON response with the updated post data or an error.
 */
export async function PUT(request: NextRequest, { params }: PostRouteParams) {
  try {
    const body = await request.json();
    return await PostController.updatePost(params.id, body);
  } catch (error) {
    console.error(
      `Failed to parse request body for post update (ID: ${params.id}):`,
      error
    );
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Handles DELETE requests to delete a post by ID.
 * @param request The NextRequest object.
 * @param params The route parameters containing the post ID.
 * @returns A JSON response indicating success or an error.
 */
export async function DELETE(
  request: NextRequest,
  { params }: PostRouteParams
) {
  return await PostController.deletePost(params.id);
}
