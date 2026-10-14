import { NextRequest } from "next/server";
import { MediaController } from "@/controllers/media.controller"; // Adjust path

/**
 * Handles GET requests to retrieve all media items.
 * @param request The NextRequest object.
 * @returns A JSON response with media data or an error.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  return await MediaController.getAllMedia(searchParams);
}

/**
 * Handles POST requests to create a new media item.
 * The request body should contain:
 * {
 * "media": { "userId": "...", "type": "image", "url": "...", ... },
 * "details": { "width": 100, "height": 200, "altText": "...", ... } // Based on 'type'
 * }
 * @param request The NextRequest object.
 * @returns A JSON response with the created media data or an error.
 */
export async function POST(request: NextRequest) {
  return await MediaController.createMedia(request);
}
