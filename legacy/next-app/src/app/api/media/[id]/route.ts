import { NextRequest } from "next/server";
import { MediaController } from "@/controllers/media.controller"; // Adjust path

// Define params type for route handlers
interface MediaRouteParams {
  params: {
    id: string;
  };
}

/**
 * Handles GET requests to retrieve a single media item by ID.
 * @param request The NextRequest object.
 * @param params The route parameters containing the media ID.
 * @returns A JSON response with media data or an error.
 */
export async function GET(request: NextRequest, { params }: MediaRouteParams) {
  return await MediaController.getMediaById(params.id);
}

/**
 * Handles PUT requests to update an existing media item by ID.
 * Note: This endpoint only updates the base `media` table.
 * @param request The NextRequest object.
 * @param params The route parameters containing the media ID.
 * @returns A JSON response with the updated media data or an error.
 */
export async function PUT(request: NextRequest, { params }: MediaRouteParams) {
  return await MediaController.updateMedia(params.id, request);
}

/**
 * Handles DELETE requests to delete a media item by ID.
 * @param request The NextRequest object.
 * @param params The route parameters containing the media ID.
 * @returns A JSON response indicating success or an error.
 */
export async function DELETE(
  request: NextRequest,
  { params }: MediaRouteParams
) {
  return await MediaController.deleteMedia(params.id);
}
