import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { locations, users } from "./users-schema";
import { relations } from "drizzle-orm";
import { medias } from "./media-schema";

import { generateUniqueId } from "@/lib/id-generator";

const ageGroupEnum = ["teen", "young_adult", "adult", "senior"] as const;
const genderEnum = ["male", "female", "other", "prefer_not_to_say"] as const;
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

export const advertisements = mysqlTable(
  "advertisements",
  {
    id,
    title: varchar("title", { length: 100 }).notNull(),
    content: varchar("content", { length: 500 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    clickUrl: varchar("click_url", { length: 500 }),
    userId: userId,
    type: mysqlEnum("type", ["banner", "sidebar", "feed", "popup"]).notNull(),
    placement: varchar("placement", { length: 100 }),
    status: mysqlEnum("status", [
      "active",
      "paused",
      "completed",
      "cancelled",
    ]).default("active"),
    targetGender: mysqlEnum("target_gender", genderEnum).notNull(),
    targetAgeStart: int("target_age_start"),
    targetAgeEnd: int("target_age_end"),
    targetLocationId: varchar("target_location_id", {
      length: 36,
    }).references(() => locations.id, { onDelete: "set null" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("advertisements_status_idx").on(table.status),
    index("advertisements_type_idx").on(table.type),
    index("advertisements_user_id_idx").on(table.userId),
    index("advertisements_placement_idx").on(table.placement),
    index("advertisements_target_gender_idx").on(table.targetGender),
    index("advertisements_target_age_start_idx").on(table.targetAgeStart),
    index("advertisements_target_age_end_idx").on(table.targetAgeEnd),
  ]
);
export const advertisementTargeting = mysqlTable(
  "advertisement_targeting",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    advertisementId: varchar("advertisement_id", { length: 36 }).notNull(),
    gender: mysqlEnum("gender", genderEnum),
    minAge: int("min_age"),
    maxAge: int("max_age"),
    ageGroup: mysqlEnum("age_group", ageGroupEnum),
    locationId: varchar("location_id", { length: 36 }),
  },
  (table) => [
    index("advertisement_targeting_advertisement_id_idx").on(
      table.advertisementId
    ),
    index("advertisement_targeting_gender_idx").on(table.gender),
    index("advertisement_targeting_min_age_idx").on(table.minAge),
    index("advertisement_targeting_max_age_idx").on(table.maxAge),
    index("advertisement_targeting_age_group_idx").on(table.ageGroup),
  ]
);
export const advertisementAttachments = mysqlTable(
  "advertisement_attachments",
  {
    id,
    advertisementId: varchar("advertisement_id", { length: 36 })
      .notNull()
      .references(() => advertisements.id, { onDelete: "cascade" }),
    mediaId: varchar("media_id", { length: 36 })
      .notNull()
      .references(() => medias.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("advertisement_attachments_advertisement_id_idx").on(
      table.advertisementId
    ),
    index("advertisement_attachments_media_id_idx").on(table.mediaId),
    index("advertisement_attachments_created_at_idx").on(table.createdAt),
  ]
);
export const advertisementsRelations = relations(
  advertisements,
  ({ one, many }) => ({
    author: one(users, {
      fields: [advertisements.userId],
      references: [users.id],
    }),
    location: one(locations, {
      fields: [advertisements.targetLocationId],
      references: [locations.id],
    }),
    attachments: many(advertisementAttachments),
    targeting: many(advertisementTargeting),
  })
);
export const advertisementTargetingRelations = relations(
  advertisementTargeting,
  ({ one }) => ({
    advertisement: one(advertisements, {
      fields: [advertisementTargeting.advertisementId],
      references: [advertisements.id],
    }),
    location: one(locations, {
      fields: [advertisementTargeting.locationId],
      references: [locations.id],
    }),
  })
);
export const advertisementAttachmentsRelations = relations(
  advertisementAttachments,
  ({ one }) => ({
    advertisement: one(advertisements, {
      fields: [advertisementAttachments.advertisementId],
      references: [advertisements.id],
    }),
    media: one(medias, {
      fields: [advertisementAttachments.mediaId],
      references: [medias.id],
    }),
  })
);
