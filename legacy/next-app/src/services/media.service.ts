import "server-only";
import { db } from "@/db";
import {
  medias,
  images,
  videos,
  documents,
  audios,
} from "@/db/schemas/media-schema"; // Adjusted paths
import {
  CreateMediaInput,
  UpdateMediaInput,
  Media,
  CreateImageInput,
  Image,
  CreateVideoInput,
  Video,
  CreateDocumentInput,
  Document,
  CreateAudioInput,
  Audio,
  FullMediaResponse,
} from "@/models/media.model";
import { eq, sql, and, desc } from "drizzle-orm";

export class MediaService {
  /**
   * Retrieves a media item by its ID, optionally with its specific type details.
   * @param id The ID of the media item.
   * @returns The media object with its type-specific details or null if not found.
   */
  static async getMediaById(id: string): Promise<FullMediaResponse | null> {
    const mediaItem = await db.query.medias.findFirst({
      where: eq(medias.id, id),
      with: {
        image: true,
        video: true,
        document: true,
        audio: true,
      },
    });
    return mediaItem || null;
  }

  /**
   * Retrieves all media items with optional filtering and pagination.
   * @param limit The maximum number of media items to return.
   * @param offset The number of media items to skip.
   * @param userId Optional: Filter by user ID.
   * @param type Optional: Filter by media type.
   * @returns An array of media objects with their type-specific details.
   */
  static async getAllMedia(
    limit: number = 10,
    offset: number = 0,
    userId?: string,
    type?: Media["type"]
  ): Promise<FullMediaResponse[]> {
    const whereClause = and(
      userId ? eq(medias.userId, userId) : undefined,
      type ? eq(medias.type, type as any) : undefined
    );

    const allMedia = await db.query.medias.findMany({
      where: whereClause,
      limit: limit,
      offset: offset,
      orderBy: desc(medias.createdAt),
      with: {
        image: true,
        video: true,
        document: true,
        audio: true,
      },
    });
    return allMedia;
  }

  /**
   * Creates a new media item and its corresponding type-specific record within a transaction.
   * @param mediaData The data for the new media item.
   * @param typeSpecificData Data for the image, video, document, or audio table.
   * @returns The created media object with its type-specific details.
   */
  static async createMedia(
    mediaData: CreateMediaInput,
    typeSpecificData:
      | CreateImageInput
      | CreateVideoInput
      | CreateDocumentInput
      | CreateAudioInput
  ): Promise<FullMediaResponse> {
    return await db.transaction(async (tx) => {
      const [newMedia] = await tx
        .insert(medias)
        .values(mediaData)
        .$returningId();
      if (!newMedia.id) {
        tx.rollback();
        throw new Error("Failed to create base media record.");
      }

      let typeRecord: Image | Video | Document | Audio | undefined;
      const mediaId = newMedia.id;

      switch (mediaData.type) {
        case "image":
          const [newImageReturn] = await tx
            .insert(images)
            .values({ ...(typeSpecificData as CreateImageInput), mediaId })
            .$returningId();
          const newImage = await tx.query.images.findFirst({
            where(fields, { eq }) {
              return eq(fields.id, newImageReturn.id);
            },
          });
          typeRecord = newImage;

          break;
        case "video":
          const [newVideoReturn] = await tx
            .insert(videos)
            .values({ ...(typeSpecificData as CreateVideoInput), mediaId })
            .$returningId();
          const newVideo = await tx.query.videos.findFirst({
            where(fields, { eq }) {
              return eq(fields.id, newVideoReturn.id);
            },
          });
          typeRecord = newVideo;
          break;
        case "document":
          const [newDocumentReturn] = await tx
            .insert(documents)
            .values({ ...(typeSpecificData as CreateDocumentInput), mediaId })
            .$returningId();
          const newDocument = await tx.query.documents.findFirst({
            where(fields, { eq }) {
              return eq(fields.id, newDocumentReturn.id);
            },
          });
          typeRecord = newDocument;
          break;
        case "audio":
          const [newAudioReturn] = await tx
            .insert(audios)
            .values({ ...(typeSpecificData as CreateAudioInput), mediaId })
            .$returningId();
          const newAudio = await tx.query.audios.findFirst({
            where(fields, { eq }) {
              return eq(fields.id, newAudioReturn.id);
            },
          });
          typeRecord = newAudio;
          break;
        default:
          tx.rollback();
          throw new Error("Unsupported media type.");
      }

      if (!typeRecord) {
        tx.rollback();
        throw new Error(`Failed to create ${mediaData.type} record.`);
      }

      // Re-fetch the full media item with relations to ensure consistency
      const createdMediaWithRelations = await tx.query.medias.findFirst({
        where: eq(medias.id, mediaId),
        with: {
          image: true,
          video: true,
          document: true,
          audio: true,
        },
      });

      if (!createdMediaWithRelations) {
        tx.rollback();
        throw new Error("Failed to retrieve full media record after creation.");
      }

      return createdMediaWithRelations;
    });
  }

  /**
   * Updates an existing media item. Note: Type-specific data updates would need separate methods.
   * @param id The ID of the media item to update.
   * @param updateData The data to update.
   * @returns The updated media object or null if not found.
   */
  static async updateMedia(
    id: string,
    updateData: UpdateMediaInput
  ): Promise<Media | null> {
    const updatedMedia = await db.transaction(async (tx) => {
      await tx
        .update(medias)
        .set({ ...updateData, updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(medias.id, id));

      return await tx.query.medias.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, id);
        },
      });
    });
    return updatedMedia || null;
  }

  /**
   * Deletes a media item by its ID. Due to cascading deletes, this will also delete
   * the associated type-specific record.
   * @param id The ID of the media item to delete.
   * @returns True if deletion was successful, false otherwise.
   */
  static async deleteMedia(id: string): Promise<boolean> {
    const result = await db.delete(medias).where(eq(medias.id, id));
    return result[0].affectedRows > 0;
  }

  // --- Specific Update Methods for type-specific details (optional, can be done via generic updateMedia or separate endpoints) ---

  /**
   * Updates an image record.
   * @param mediaId The mediaId associated with the image.
   * @param updateData The data to update.
   * @returns The updated image object or null.
   */
  static async updateImage(
    mediaId: string,
    updateData: Partial<CreateImageInput>
  ): Promise<Image | null> {
    const updatedImage = await db.transaction(async (tx) => {
      await tx
        .update(images)
        .set(updateData)
        .where(eq(images.mediaId, mediaId));
      return await tx.query.images.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, mediaId);
        },
      });
    });
    return updatedImage || null;
  }

  /**
   * Updates a video record.
   * @param mediaId The mediaId associated with the video.
   * @param updateData The data to update.
   * @returns The updated video object or null.
   */
  static async updateVideo(
    mediaId: string,
    updateData: Partial<CreateVideoInput>
  ): Promise<Video | null> {
    const updatedVideo = await db.transaction(async (tx) => {
      await tx
        .update(videos)
        .set(updateData)
        .where(eq(videos.mediaId, mediaId));
      return await tx.query.videos.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, mediaId);
        },
      });
    });
    return updatedVideo || null;
  }

  /**
   * Updates a document record.
   * @param mediaId The mediaId associated with the document.
   * @param updateData The data to update.
   * @returns The updated document object or null.
   */
  static async updateDocument(
    mediaId: string,
    updateData: Partial<CreateDocumentInput>
  ): Promise<Document | null> {
    const updatedDocument = await db.transaction(async (tx) => {
      await tx
        .update(documents)
        .set(updateData)
        .where(eq(documents.mediaId, mediaId));
      return await tx.query.documents.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, mediaId);
        },
      });
    });
    return updatedDocument || null;
  }

  /**
   * Updates an audio record.
   * @param mediaId The mediaId associated with the audios.
   * @param updateData The data to update.
   * @returns The updated audio object or null.
   */
  static async updateAudio(
    mediaId: string,
    updateData: Partial<CreateAudioInput>
  ): Promise<Audio | null> {
    const updatedAudio = await db.transaction(async (tx) => {
      await tx
        .update(audios)
        .set(updateData)
        .where(eq(audios.mediaId, mediaId));
      return await tx.query.audios.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, mediaId);
        },
      });
    });
    return updatedAudio || null;
  }
}
