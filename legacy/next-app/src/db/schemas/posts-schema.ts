import {
  mysqlTable,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
  int,
  json,
  mysqlEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

import { medias } from "./media-schema";
import { locations, users } from "./users-schema";
import { generateUniqueId } from "@/lib/id-generator";

const postTypeEnum = ["general", "product", "service", "event"] as const;
const postStatusEnum = ["draft", "published", "archived", "deleted"] as const;
const postVisibilityEnum = ["public", "followers", "nearby"] as const;
const currency = varchar("currency", { length: 3 }).default("NGN");
const reactionType = [
  "like",
  "love",
  "support",
  "interesting",
  "want",
] as const;
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
// Posts table - Enhanced with better structure
export const posts = mysqlTable(
  "posts",
  {
    id,
    userId,
    type: mysqlEnum("type", postTypeEnum).notNull(),
    content: text("content"),
    status: mysqlEnum("status", postStatusEnum).default("published"),
    visibility: mysqlEnum("visibility", postVisibilityEnum)
      .default("public")
      .notNull(),
    locationId: varchar("location_id", { length: 36 }).references(
      () => locations.id,
      { onDelete: "set null" }
    ),
    isPromoted: boolean("is_promoted").default(false),
    publishedAt: timestamp("published_at"),
    likesCount: int("likes_count").default(0),
    commentsCount: int("comments_count").default(0),
    sharesCount: int("shares_count").default(0),
    viewsCount: int("views_count").default(0),

    createdAt,
    updatedAt,
  },
  (table) => [
    index("posts_user_id_idx").on(table.userId),
    index("posts_type_idx").on(table.type),
    index("posts_status_idx").on(table.status),
    index("posts_location_id_idx").on(table.locationId),
    index("posts_published_at_idx").on(table.publishedAt),
    index("posts_visibility_idx").on(table.visibility),
    index("posts_is_promoted_idx").on(table.isPromoted),
    index("posts_created_at_idx").on(table.createdAt),
    index("posts_updated_at_idx").on(table.updatedAt),
    index("posts_likes_count_idx").on(table.likesCount),
    index("posts_comments_count_idx").on(table.commentsCount),
    index("posts_shares_count_idx").on(table.sharesCount),
    index("posts_views_count_idx").on(table.viewsCount),
    sql`FULLTEXT INDEX (content) WITH PARSER MULTILINGUAL`,
  ]
);
export const postMentions = mysqlTable("post_mentions", {
  id,
  postId: varchar("post_id", { length: 36 })
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  mentionedUserId: varchar("mentioned_user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});
export const postReactions = mysqlTable(
  "post_reactions",
  {
    id,
    userId,
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    type: mysqlEnum("type", reactionType).notNull(),
    createdAt,
  },
  (table) => [
    uniqueIndex("post_reactions_unique_user_post").on(
      table.userId,
      table.postId
    ),
    index("post_reactions_user_id_idx").on(table.userId),
    index("post_reactions_post_id_idx").on(table.postId),
  ]
);

// Product details - For product posts
export const products = mysqlTable(
  "products",
  {
    id,
    name: varchar("name", { length: 100 }).notNull(),
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    description: varchar("description", { length: 500 }),
    mediaId: varchar("media_id", { length: 36 }),
    category: varchar("category", { length: 100 }),
    sku: varchar("sku", { length: 100 }),
    price: decimal("price", { precision: 10, scale: 2, mode: "number" }),
    compareAtPrice: decimal("compare_at_price", {
      precision: 10,
      scale: 2,
      mode: "number",
    }),
    currency,
    condition: mysqlEnum("condition", ["new", "used", "refurbished"]).default(
      "new"
    ),
    availability: mysqlEnum("availability", [
      "in_stock",
      "out_of_stock",
      "pre_order",
      "discontinued",
    ]).default("in_stock"),
    stockQuantity: int("stock_quantity"),
    minOrderQuantity: int("min_order_quantity").default(1),
    maxOrderQuantity: int("max_order_quantity"),
    weight: decimal("weight", { precision: 8, scale: 3, mode: "number" }), // in kg
    dimensions: json("dimensions"), // { length, width, height }
    brand: varchar("brand", { length: 100 }),
    model: varchar("model", { length: 100 }),
    warranty: varchar("warranty", { length: 200 }),
    isNegotiable: boolean("is_negotiable").default(false),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("products_post_id_idx").on(table.postId),
    index("products_sku_idx").on(table.sku),
    index("products_price_idx").on(table.price),
    index("products_compare_price_idx").on(table.compareAtPrice),
    index("products_availability_idx").on(table.availability),
  ]
);

// Service details - For service posts
export const services = mysqlTable(
  "services",
  {
    id,
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .unique()
      .references(() => posts.id, { onDelete: "cascade" }),
    serviceType: varchar("service_type", { length: 100 }).notNull(),
    priceType: mysqlEnum("price_type", [
      "fixed",
      "hourly",
      "per_project",
      "negotiable",
    ]).notNull(),
    price: decimal("price", { precision: 10, scale: 2, mode: "number" }),
    currency,
    duration: varchar("duration", { length: 100 }), // e.g., "2 hours", "1 day"
    availability: json("availability"), // Available days/hours
    serviceVenue: mysqlEnum("service_venue", [
      "onsite",
      "remote",
      "hybrid",
    ]).default("onsite"),
    serviceRadius: int("service_radius"), // km radius for onsite services
    experienceYears: int("experience_years"),
    certifications: json("certifications"), // string[]
    portfolio: json("portfolio"), // URLs to previous work
    createdAt,
    updatedAt,
  },
  (table) => [
    index("services_post_id_idx").on(table.postId),
    index("services_type_idx").on(table.serviceType),
    index("services_price_type_idx").on(table.priceType),
  ]
);

// Event details - For event posts
export const events = mysqlTable(
  "events",
  {
    id,
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .unique()
      .references(() => posts.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 100 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    startTime: varchar("start_time", { length: 10 }), // HH:MM format
    endTime: varchar("end_time", { length: 10 }),
    timezone: varchar("timezone", { length: 50 }).default("Africa/Lagos"),
    coverImageUrl: varchar("cover_image_url", { length: 500 }),
    venue: varchar("venue", { length: 200 }),
    venueLocationId: varchar("venue_location_id", { length: 36 }).references(
      () => locations.id,
      { onDelete: "set null" }
    ),
    eventVenueType: mysqlEnum("event_venue_type", [
      "online",
      "offline",
    ]).default("offline"),
    meetingUrl: varchar("meeting_url", { length: 500 }),
    capacity: int("capacity"),
    currentAttendees: int("current_attendees").default(0),
    ticketPrice: decimal("ticket_price", {
      precision: 10,
      scale: 2,
      mode: "number",
    }),
    isTicketRequired: boolean("is_ticket_required").default(false),
    registrationDeadline: timestamp("registration_deadline"),
    contactInfo: json("contact_info"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("events_post_id_idx").on(table.postId),
    index("events_start_date_idx").on(table.startDate),
    index("events_title_idx").on(table.title),
    index("events_venue_idx").on(table.venue),
    index("events_venue_location_id_idx").on(table.venueLocationId),
    index("events_event_venue_type_idx").on(table.eventVenueType),
    index("events_capacity_idx").on(table.capacity),
    index("events_current_attendees_idx").on(table.currentAttendees),
    index("events_ticket_price_idx").on(table.ticketPrice),
    index("events_registration_deadline_idx").on(table.registrationDeadline),
    //end date
    index("events_end_date_idx").on(table.endDate),
  ]
);
export const eventAttendees = mysqlTable(
  "event_attendees",
  {
    id,
    eventId: varchar("event_id", { length: 36 }).references(() => events.id, {
      onDelete: "cascade",
    }),
    userId: userId,
    createdAt,
    updatedAt,
  },
  (table) => [
    index("event_attendees_event_id_idx").on(table.eventId),
    index("event_attendees_user_id_idx").on(table.userId),
  ]
);

export const postMedia = mysqlTable(
  "post_media",
  {
    id,
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    mediaId: varchar("media_id", { length: 36 })
      .notNull()
      .references(() => medias.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").default(false),
    sortOrder: int("sort_order").default(0),
    altText: varchar("alt_text", { length: 500 }),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("post_media_post_id_idx").on(table.postId),
    index("post_media_media_id_idx").on(table.mediaId),
    index("post_media_alt_text_idx").on(table.altText),
    index("post_media_is_primary_idx").on(table.isPrimary),
    index("post_media_sort_order_idx").on(table.sortOrder),
  ]
);
export const productMedia = mysqlTable(
  "product_media",
  {
    id,
    productId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    mediaId: varchar("media_id", { length: 36 })
      .notNull()
      .references(() => medias.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").default(false),
    sortOrder: int("sort_order").default(0),
    altText: varchar("alt_text", { length: 500 }),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("post_media_product_id_idx").on(table.productId),
    index("post_media_media_id_idx").on(table.mediaId),
    index("post_media_alt_text_idx").on(table.altText),
    index("post_media_is_primary_idx").on(table.isPrimary),
    index("post_media_sort_order_idx").on(table.sortOrder),
  ]
);
export const serviceMedia = mysqlTable(
  "service_media",
  {
    id,
    serviceId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    mediaId: varchar("media_id", { length: 36 })
      .notNull()
      .references(() => medias.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").default(false),
    sortOrder: int("sort_order").default(0),
    altText: varchar("alt_text", { length: 500 }),

    createdAt,
    updatedAt,
  },
  (table) => [
    index("post_media_service_id_idx").on(table.serviceId),
    index("post_media_media_id_idx").on(table.mediaId),
    index("post_media_alt_text_idx").on(table.altText),
    index("post_media_is_primary_idx").on(table.isPrimary),
    index("post_media_sort_order_idx").on(table.sortOrder),
  ]
);

// Comments table - Enhanced with better threading
//@ts-ignore
export const postComments = mysqlTable(
  "post_comments",
  {
    id,

    userId: userId,
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    parentId: varchar("parent_id", {
      length: 36,
      //@ts-ignore
    }).references(() => postComments.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", [
      "pending",
      "approved",
      "deleted",
      "hidden",
    ]).default("approved"),
    isEdited: boolean("is_edited").default(false),
    editedAt: timestamp("edited_at"),
    reactionCount: int("reaction_count").default(0), // Denormalized counter
    replyCount: int("reply_count").default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("comments_user_id_idx").on(table.userId),
    index("comments_post_id_idx").on(table.postId),
    index("comments_status_idx").on(table.status),
    index("comments_parent_id_idx").on(table.parentId),
    index("comments_edited_at_idx").on(table.editedAt),
    index("comments_reaction_count_idx").on(table.reactionCount),
    index("comments_reply_count_idx").on(table.replyCount),
  ]
);
export const postCommentMentions = mysqlTable(
  "post_comment_mentions",
  {
    id,
    commentId: varchar("comment_id", { length: 36 })
      .notNull()
      .references(() => postComments.id, { onDelete: "cascade" }),
    mentionedUserId: varchar("mentioned_user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    positionStart: int("position_start"),
    positionEnd: int("position_end"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("comment_mentions_comment_id_idx").on(table.commentId),
    index("comment_mentions_user_id_idx").on(table.mentionedUserId),
  ]
);

export const commentReactions = mysqlTable(
  "comment_reactions",
  {
    id,
    userId,
    commentId: varchar("comment_id", { length: 36 })
      .notNull()
      .references(() => postComments.id, { onDelete: "cascade" }),
    type: mysqlEnum("type", reactionType).notNull(),
    createdAt,
  },
  (table) => [
    uniqueIndex("comment_reactions_unique_user_comment").on(
      table.userId,
      table.commentId
    ),
    index("comment_reactions_user_id_idx").on(table.userId),
    index("comment_reactions_comment_id_idx").on(table.commentId),
  ]
);

export const postCommentMedia = mysqlTable(
  "post_comment_media",
  {
    id,
    commentId: varchar("comment_id", { length: 36 })
      .notNull()
      .references(() => postComments.id, { onDelete: "cascade" }),
    mediaId: varchar("media_id", { length: 36 })
      .notNull()
      .references(() => medias.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("post_comment_media_comment_id_idx").on(table.commentId),
    index("post_comment_media_media_id_idx").on(table.mediaId),
  ]
);

// Post promotions (paid advertising)
export const postPromotions = mysqlTable(
  "post_promotions",
  {
    id,
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: userId,

    budget: decimal("budget", {
      precision: 10,
      scale: 2,
      mode: "number",
    }).default(0),
    spent: decimal("spent", {
      precision: 10,
      scale: 2,
      mode: "number",
    }).default(0),
    currency,
    targetRadius: int("target_radius"),
    targetLocationId: varchar("target_location_id", {
      length: 36,
    }).references(() => locations.id, { onDelete: "set null" }),
    targetAudience: json("target_audience"),
    impressions: int("impressions").default(0),
    clicks: int("clicks").default(0),
    conversions: int("conversions").default(0),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    dailyBudget: decimal("daily_budget", {
      precision: 10,
      scale: 2,
      mode: "number",
    }),
    type: mysqlEnum("type", [
      "boost",
      "featured",
      "location_targeted",
      "demographic_targeted",
      "interest_targeted",
    ]).notNull(),
    status: mysqlEnum("status", [
      "active",
      "paused",
      "completed",
      "cancelled",
      "pending_approval",
    ]).default("pending_approval"),
    approvedAt: timestamp("approved_at"),
    approvedBy: varchar("approved_by", { length: 36 }),
    rejectionReason: text("rejection_reason"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("post_promotions_post_id_idx").on(table.postId),
    index("post_promotions_user_id_idx").on(table.userId),
    index("post_promotions_status_idx").on(table.status),
    index("post_promotions_type_idx").on(table.type),
    index("post_promotions_start_date_idx").on(table.startDate),
    index("post_promotions_end_date_idx").on(table.endDate),
  ]
);

// Platform ads (non-post related advertising)

//relations

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [posts.locationId],
    references: [locations.id],
  }),
  comments: many(postComments),
  medias: many(postMedia),
  reactions: many(postReactions),
  products: many(products),
  eventDetail: one(events, {
    fields: [posts.id],
    references: [events.postId],
  }),
  serviceDetail: one(services, {
    fields: [posts.id],
    references: [services.postId],
  }),
  mentions: many(postMentions),
}));

export const postCommentsRelations = relations(
  postComments,
  ({ one, many }) => ({
    author: one(users, {
      fields: [postComments.userId],
      references: [users.id],
    }),
    post: one(posts, {
      fields: [postComments.postId],
      references: [posts.id],
    }),
    parent: one(postComments, {
      fields: [postComments.parentId],
      references: [postComments.id],
    }),
    medias: many(postCommentMedia),
    reactions: many(commentReactions),
    mentions: many(postCommentMentions),
  })
);

// Post Reactions Relation
export const postReactionsRelations = relations(postReactions, ({ one }) => ({
  user: one(users, {
    fields: [postReactions.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [postReactions.postId],
    references: [posts.id],
  }),
}));

// Comment Reactions Relation
export const commentReactionsRelations = relations(
  commentReactions,
  ({ one }) => ({
    user: one(users, {
      fields: [commentReactions.userId],
      references: [users.id],
    }),
    comment: one(postComments, {
      fields: [commentReactions.commentId],
      references: [postComments.id],
    }),
  })
);

export const postPromotionsRelations = relations(postPromotions, ({ one }) => ({
  post: one(posts, {
    fields: [postPromotions.postId],
    references: [posts.id],
  }),
}));
export const productsRelations = relations(products, ({ one, many }) => ({
  post: one(posts, {
    fields: [products.postId],
    references: [posts.id],
  }),
  media: many(productMedia),
}));
export const servicesRelations = relations(services, ({ one, many }) => ({
  post: one(posts, {
    fields: [services.postId],
    references: [posts.id],
  }),
  media: many(serviceMedia),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  post: one(posts, {
    fields: [events.postId],
    references: [posts.id],
  }),

  attendees: many(eventAttendees),
}));
export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventAttendees.userId],
    references: [users.id],
  }),
}));
export const productMediaRelations = relations(productMedia, ({ one }) => ({
  product: one(products, {
    fields: [productMedia.productId],
    references: [products.id],
  }),
  media: one(medias, {
    fields: [productMedia.mediaId],
    references: [medias.id],
  }),
}));
export const serviceMediaRelations = relations(serviceMedia, ({ one }) => ({
  service: one(services, {
    fields: [serviceMedia.serviceId],
    references: [services.id],
  }),
  media: one(medias, {
    fields: [serviceMedia.mediaId],
    references: [medias.id],
  }),
}));

export const postMediaRelations = relations(postMedia, ({ one }) => ({
  post: one(posts, {
    fields: [postMedia.postId],
    references: [posts.id],
  }),
  media: one(medias, {
    fields: [postMedia.mediaId],
    references: [medias.id],
  }),
}));
export const postCommentMediaRelations = relations(
  postCommentMedia,
  ({ one }) => ({
    comment: one(postComments, {
      fields: [postCommentMedia.commentId],
      references: [postComments.id],
    }),
    media: one(medias, {
      fields: [postCommentMedia.mediaId],
      references: [medias.id],
    }),
  })
);
