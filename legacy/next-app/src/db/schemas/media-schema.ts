import { relations } from "drizzle-orm";

import {
  mysqlTable,
  mysqlEnum,
  varchar,
  int,
  boolean,
  timestamp,
  decimal,
} from "drizzle-orm/mysql-core";
import { users } from "./users-schema";
import {
  postCommentMedia,
  postMedia,
  productMedia,
  serviceMedia,
} from "./posts-schema";
import { advertisementAttachments } from "./advertisements-schema";
import { generateUniqueId } from "@/lib/id-generator";

const mediaType = ["image", "video", "audio", "document"] as const;
const id = varchar("id", { length: 36 })
  .primaryKey()
  .$defaultFn(
    () => generateUniqueId() // this should be bigint string e.g 17489305838459032
  );
const userId = varchar("user_id", { length: 36 })
  .notNull()
  .references(() => users.id, { onDelete: "cascade" });
const createdAt = timestamp("created_at").defaultNow();
const updatedAt = timestamp("updated_at").defaultNow().onUpdateNow();
// Base media table with common fields
export const medias = mysqlTable("media", {
  id,
  userId: userId,
  type: mysqlEnum("type", mediaType).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  fileName: varchar("file_name", { length: 255 }),
  fileSize: int("file_size"),
  cdnPublicId: varchar("cdn_public_id", { length: 255 }),
  createdAt,
  updatedAt,
});

// Type-specific tables
export const images = mysqlTable("images", {
  id,
  mediaId: varchar("media_id", { length: 36 })
    .notNull()
    .references(() => medias.id, { onDelete: "cascade" }),
  width: int("width").notNull(),
  height: int("height").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  colorProfile: varchar("color_profile", { length: 50 }),
  isAnimated: boolean("is_animated").default(false),
});

export const videos = mysqlTable("videos", {
  id,
  mediaId: varchar("media_id", { length: 36 })
    .notNull()
    .references(() => medias.id, { onDelete: "cascade" }),
  duration: int("duration").notNull(), // seconds
  width: int("width"),
  height: int("height"),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  bitrate: int("bitrate"),
  codec: varchar("codec", { length: 50 }),
  frameRate: decimal("frame_rate", { precision: 5, scale: 2, mode: "number" }),
});

export const documents = mysqlTable("documents", {
  id,
  mediaId: varchar("media_id", { length: 36 })
    .notNull()
    .references(() => medias.id, { onDelete: "cascade" }),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  pageCount: int("page_count"),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  isSearchable: boolean("is_searchable").default(false),
});

export const audios = mysqlTable("audios", {
  id,
  mediaId: varchar("media_id", { length: 36 })
    .notNull()
    .references(() => medias.id, { onDelete: "cascade" }),
  duration: int("duration").notNull(), // seconds
  bitrate: int("bitrate"),
  sampleRate: int("sample_rate"),
  channels: int("channels"),
  format: varchar("format", { length: 20 }),
});

// Relations
export const mediaRelations = relations(medias, ({ one, many }) => ({
  owner: one(users, { fields: [medias.userId], references: [users.id] }),
  image: one(images, { fields: [medias.id], references: [images.mediaId] }),
  video: one(videos, { fields: [medias.id], references: [videos.mediaId] }),
  document: one(documents, {
    fields: [medias.id],
    references: [documents.mediaId],
  }),
  audio: one(audios, { fields: [medias.id], references: [audios.mediaId] }),
  postMedia: one(postMedia, {
    fields: [medias.id],
    references: [postMedia.mediaId],
  }),
  postCommentMedia: one(postCommentMedia, {
    fields: [medias.id],
    references: [postCommentMedia.mediaId],
  }),
  productMedia: one(productMedia, {
    fields: [medias.id],
    references: [productMedia.mediaId],
  }),
  serviceMedia: one(serviceMedia, {
    fields: [medias.id],
    references: [serviceMedia.mediaId],
  }),
  advertisementAttachments: one(advertisementAttachments, {
    fields: [medias.id],
    references: [advertisementAttachments.mediaId],
  }),
}));
