import {
  CreateMediaInput,
  UpdateMediaInput,
  CreateMediaSchema,
  UpdateMediaSchema,
  FullMediaResponseSchema,
  CreateImageSchema,
  CreateVideoSchema,
  CreateDocumentSchema,
  CreateAudioSchema,
  CreateImageInput,
  CreateVideoInput,
  CreateDocumentInput,
  CreateAudioInput,
  Media,
} from "@/models/media.model";
import { MediaService } from "@/services/media.service";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod/v4";

export class MediaController {
  /**
   * Handles fetching a media item by ID.
   * @param id The media ID from the request params.
   * @returns A NextApiResponse with the media data or an error.
   */
  static async getMediaById(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json(
          { error: "Media ID is required." },
          { status: 400 }
        );
      }

      const mediaItem = await MediaService.getMediaById(id);

      if (!mediaItem) {
        return NextResponse.json(
          { error: "Media not found." },
          { status: 404 }
        );
      }

      const validatedMedia = FullMediaResponseSchema.safeParse(mediaItem);
      if (!validatedMedia.success) {
        console.error(
          "Media data validation failed for ID:",
          id,
          validatedMedia.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid media data." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedMedia.data, { status: 200 });
    } catch (error) {
      console.error("Error fetching media by ID:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles fetching all media items.
   * @param searchParams URLSearchParams for filtering and pagination.
   * @returns A NextApiResponse with an array of media data.
   */
  static async getAllMedia(
    searchParams: URLSearchParams
  ): Promise<NextResponse> {
    try {
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const offset = parseInt(searchParams.get("offset") || "0", 10);
      const userId = searchParams.get("userId") || undefined;
      const type = (searchParams.get("type") as Media["type"]) || undefined;

      if (isNaN(limit) || limit <= 0 || isNaN(offset) || offset < 0) {
        return NextResponse.json(
          { error: "Invalid limit or offset parameters." },
          { status: 400 }
        );
      }

      const mediaItems = await MediaService.getAllMedia(
        limit,
        offset,
        userId,
        type
      );

      const validatedMediaItems = z
        .array(FullMediaResponseSchema)
        .safeParse(mediaItems);
      if (!validatedMediaItems.success) {
        console.error(
          "Multiple media data validation failed:",
          validatedMediaItems.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid media data found." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedMediaItems.data, { status: 200 });
    } catch (error) {
      console.error("Error fetching all media:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles creating a new media item.
   * The request body is expected to contain a 'media' field for base media data
   * and a 'details' field for type-specific data (e.g., 'imageDetails', 'videoDetails').
   * @param request The NextRequest object containing the JSON body.
   * @returns A NextApiResponse with the created media data or an error.
   */
  static async createMedia(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();

      const mediaDataResult = CreateMediaSchema.safeParse(body.media);
      if (!mediaDataResult.success) {
        return NextResponse.json(
          {
            error: "Validation failed for base media data.",
            details: mediaDataResult.error.issues,
          },
          { status: 400 }
        );
      }
      const mediaData: CreateMediaInput = mediaDataResult.data;

      let typeSpecificData:
        | CreateImageInput
        | CreateVideoInput
        | CreateDocumentInput
        | CreateAudioInput;
      let typeSpecificSchema: z.ZodSchema<any>;

      switch (mediaData.type) {
        case "image":
          typeSpecificSchema = CreateImageSchema;
          break;
        case "video":
          typeSpecificSchema = CreateVideoSchema;
          break;
        case "document":
          typeSpecificSchema = CreateDocumentSchema;
          break;
        case "audio":
          typeSpecificSchema = CreateAudioSchema;
          break;
        default:
          return NextResponse.json(
            { error: "Unsupported media type provided." },
            { status: 400 }
          );
      }

      const typeSpecificDataResult = typeSpecificSchema.safeParse(body.details);
      if (!typeSpecificDataResult.success) {
        return NextResponse.json(
          {
            error: `Validation failed for ${mediaData.type} details.`,
            details: typeSpecificDataResult.error.issues,
          },
          { status: 400 }
        );
      }
      typeSpecificData = typeSpecificDataResult.data;

      const newMedia = await MediaService.createMedia(
        mediaData,
        typeSpecificData
      );

      const validatedMedia = FullMediaResponseSchema.safeParse(newMedia);
      if (!validatedMedia.success) {
        console.error(
          "Created media data validation failed:",
          validatedMedia.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid created media data." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedMedia.data, { status: 201 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error creating media:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles updating an existing media item.
   * Note: This only updates the base `media` table. Updates to type-specific tables
   * would require a separate endpoint or more complex body parsing.
   * @param id The media ID from the request params.
   * @param request The NextRequest object containing the JSON body.
   * @returns A NextApiResponse with the updated media data or an error.
   */
  static async updateMedia(
    id: string,
    request: NextRequest
  ): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json(
          { error: "Media ID is required." },
          { status: 400 }
        );
      }

      const body = await request.json();
      const validatedData = UpdateMediaSchema.parse(body); // Only validate for base media update

      const updatedMedia = await MediaService.updateMedia(id, validatedData);

      if (!updatedMedia) {
        return NextResponse.json(
          { error: "Media not found or nothing to update." },
          { status: 404 }
        );
      }

      // Re-fetch with relations to ensure the full object is returned
      const fullUpdatedMedia = await MediaService.getMediaById(id);
      if (!fullUpdatedMedia) {
        return NextResponse.json(
          { error: "Failed to retrieve updated media with details." },
          { status: 500 }
        );
      }

      const validatedFullMedia =
        FullMediaResponseSchema.safeParse(fullUpdatedMedia);
      if (!validatedFullMedia.success) {
        console.error(
          "Updated media data validation failed:",
          validatedFullMedia.error
        );
        return NextResponse.json(
          { error: "Internal server error: Invalid updated media data." },
          { status: 500 }
        );
      }

      return NextResponse.json(validatedFullMedia.data, { status: 200 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error updating media:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  /**
   * Handles deleting a media item.
   * @param id The media ID from the request params.
   * @returns A NextApiResponse with a success message or an error.
   */
  static async deleteMedia(id: string): Promise<NextResponse> {
    try {
      if (!id) {
        return NextResponse.json(
          { error: "Media ID is required." },
          { status: 400 }
        );
      }

      const deleted = await MediaService.deleteMedia(id);

      if (!deleted) {
        return NextResponse.json(
          { error: "Media not found or could not be deleted." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Media deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting media:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  // You might consider adding specific endpoints for updating ONLY the type-specific details
  // e.g., patch /api/media/images/[mediaId] for image-specific updates
  // For simplicity, the above `updateMedia` handles the base table.
}
