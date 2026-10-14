import {
  medias,
  images,
  videos,
  documents,
  audios,
} from "@/db/schemas/media-schema"; // Adjusted path to your Drizzle schema file
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod/v4";

// ----------------------------------------------------
// Base Media Schema
// ----------------------------------------------------
export type Media = typeof medias.$inferSelect;
export type NewMedia = typeof medias.$inferInsert;

export const CreateMediaSchema = createInsertSchema(medias, {
  userId: z.string().length(36, "Invalid user ID format."),
  type: z.enum(medias.type.enumValues),
  url: z.url("Invalid URL format.").max(500, "URL is too long."),
  fileName: z.string().max(255, "File name is too long.").optional().nullable(),
  fileSize: z
    .number()
    .int()
    .positive("File size must be a positive integer.")
    .optional()
    .nullable(),
  cdnPublicId: z
    .string()
    .max(255, "CDN Public ID is too long.")
    .optional()
    .nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateMediaSchema = createUpdateSchema(medias, {
  id: z.string().length(36, "Invalid Media ID format.").optional(),
});

export const SelectMediaSchema = createSelectSchema(medias);

export type CreateMediaInput = z.infer<typeof CreateMediaSchema>;
export type UpdateMediaInput = z.infer<typeof UpdateMediaSchema>;
export type MediaResponse = z.infer<typeof SelectMediaSchema>;

// ----------------------------------------------------
// Image Schema
// ----------------------------------------------------
export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;

export const CreateImageSchema = createInsertSchema(images, {
  mediaId: z.string().length(36, "Invalid media ID format."),
  width: z.number().int().positive("Width must be a positive integer."),
  height: z.number().int().positive("Height must be a positive integer."),
  altText: z.string().max(255, "Alt text is too long.").optional().nullable(),
  thumbnailUrl: z
    .string()
    .url("Invalid thumbnail URL format.")
    .max(500, "Thumbnail URL is too long.")
    .optional()
    .nullable(),
  colorProfile: z
    .string()
    .max(50, "Color profile is too long.")
    .optional()
    .nullable(),
}).omit({
  id: true,
});

export const SelectImageSchema = createSelectSchema(images);

export type CreateImageInput = z.infer<typeof CreateImageSchema>;
export type ImageResponse = z.infer<typeof SelectImageSchema>;

// ----------------------------------------------------
// Video Schema
// ----------------------------------------------------
export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;

export const CreateVideoSchema = createInsertSchema(videos, {
  mediaId: z.string().length(36, "Invalid media ID format."),
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive integer.")
    .min(1, "Video must have a duration."),
  width: z
    .number()
    .int()
    .positive("Width must be a positive integer.")
    .optional()
    .nullable(),
  height: z
    .number()
    .int()
    .positive("Height must be a positive integer.")
    .optional()
    .nullable(),
  thumbnailUrl: z
    .string()
    .url("Invalid thumbnail URL format.")
    .max(500, "Thumbnail URL is too long.")
    .optional()
    .nullable(),
  bitrate: z
    .number()
    .int()
    .positive("Bitrate must be a positive integer.")
    .optional()
    .nullable(),
  codec: z.string().max(50, "Codec is too long.").optional().nullable(),
  frameRate: z
    .number()
    .positive("Frame rate must be positive.")
    .optional()
    .nullable(),
}).omit({
  id: true,
});

export const SelectVideoSchema = createSelectSchema(videos);

export type CreateVideoInput = z.infer<typeof CreateVideoSchema>;
export type VideoResponse = z.infer<typeof SelectVideoSchema>;

// ----------------------------------------------------
// Document Schema
// ----------------------------------------------------
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export const CreateDocumentSchema = createInsertSchema(documents, {
  mediaId: z.string().length(36, "Invalid media ID format."),
  mimeType: z.string().max(100, "MIME type is too long."),
  pageCount: z
    .number()
    .int()
    .positive("Page count must be a positive integer.")
    .optional()
    .nullable(),
  thumbnailUrl: z
    .url("Invalid thumbnail URL format.")
    .max(500, "Thumbnail URL is too long.")
    .optional()
    .nullable(),
}).omit({
  id: true,
});

export const SelectDocumentSchema = createSelectSchema(documents);

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;
export type DocumentResponse = z.infer<typeof SelectDocumentSchema>;

// ----------------------------------------------------
// Audio Schema
// ----------------------------------------------------
export type Audio = typeof audios.$inferSelect;
export type NewAudio = typeof audios.$inferInsert;

export const CreateAudioSchema = createInsertSchema(audios, {
  mediaId: z.string().length(36, "Invalid media ID format."),
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive integer.")
    .min(1, "Audio must have a duration."),
  bitrate: z
    .number()
    .int()
    .positive("Bitrate must be a positive integer.")
    .optional()
    .nullable(),
  sampleRate: z
    .number()
    .int()
    .positive("Sample rate must be a positive integer.")
    .optional()
    .nullable(),
  channels: z
    .number()
    .int()
    .positive("Channels must be a positive integer.")
    .optional()
    .nullable(),
  format: z.string().max(20, "Format is too long.").optional().nullable(),
}).omit({
  id: true,
});

export const SelectAudioSchema = createSelectSchema(audios);

export type CreateAudioInput = z.infer<typeof CreateAudioSchema>;
export type AudioResponse = z.infer<typeof SelectAudioSchema>;

// ----------------------------------------------------
// Combined Media Response for Relations
// ----------------------------------------------------
export const FullMediaResponseSchema = SelectMediaSchema.extend({
  image: SelectImageSchema.optional(),
  video: SelectVideoSchema.optional(),
  document: SelectDocumentSchema.optional(),
  audio: SelectAudioSchema.optional(),
});

export type FullMediaResponse = z.infer<typeof FullMediaResponseSchema>;
