import {
  mysqlTable,
  varchar,
  text,
  boolean,
  timestamp,
  mysqlEnum,
  json,
  index,
  uniqueIndex,
  int,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./users-schema";
import { generateUniqueId } from "@/lib/id-generator";

type NotificationPreferences = {
  social: {
    likes: { in_app: boolean; email: boolean; push: boolean };
    comments: { in_app: boolean; email: boolean; push: boolean };
    follows: { in_app: boolean; email: boolean; push: boolean };
    posts: { in_app: boolean; email: boolean; push: boolean };
  };
  business: {
    reviews: { in_app: boolean; email: boolean; push: boolean; sms: boolean };
    orders: { in_app: boolean; email: boolean; push: boolean; sms: boolean };
  };
  messages: {
    direct: { in_app: boolean; email: boolean; push: boolean };
    group: { in_app: boolean; email: boolean; push: boolean };
  };
  system: {
    security: { in_app: boolean; email: boolean; push: boolean; sms: boolean };
    features: { in_app: boolean; email: boolean; push: boolean };
  };
};
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
// Main notifications table
export const notifications = mysqlTable(
  "notifications",
  {
    id,

    recipientId: varchar("recipient_id", { length: 36 }).references(
      () => users.id,
      { onDelete: "cascade" }
    ), // Null for system notifications
    senderId: varchar("sender_id", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }), // Null for system notifications
    type: mysqlEnum("type", [
      // Social interactions
      "like",
      "comment",
      "reply",
      "mention",
      "follow",
      "unfollow",

      // Posts & Content
      "post_shared",
      "post_featured",
      "post_approved",
      "post_rejected",

      // Business & Reviews
      "review_received",
      "review_reply",
      "business_verified",
      "business_suspended",

      // Messages
      "message_received",
      "message_reaction",

      // Events
      "event_reminder",
      "event_invitation",
      "event_cancelled",
      "event_updated",

      // Transactions & Subscriptions
      "subscription_expiring",
      "subscription_renewed",
      "subscription_cancelled",
      "payment_successful",
      "payment_failed",

      // Promotions & Ads
      "promotion_approved",
      "promotion_rejected",
      "promotion_budget_low",
      "promotion_completed",

      // System
      "account_warning",
      "feature_announcement",
      "maintenance_notice",
      "security_alert",
      "welcome",
    ]).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),

    // Polymorphic reference to related entity
    entityType: mysqlEnum("entity_type", [
      "post",
      "comment",
      "user",
      "review",
      "message",
      "conversation",
      "event",
      "subscription",
      "promotion",
      "advertisement",
    ]),
    entityId: varchar("entity_id", { length: 36 }),

    // Additional context data (JSON for flexibility)
    metadata: json("metadata"), // { postType, eventDate, amount, etc. }

    // Status tracking
    isRead: boolean("is_read").default(false),
    readAt: timestamp("read_at"),

    // Delivery channels
    channels: json("channels").$default(() => sql`CAST('["in_app"]' AS JSON)`), // ["in_app", "email", "push", "sms"]

    // Priority level
    priority: mysqlEnum("priority", [
      "low",
      "normal",
      "high",
      "urgent",
    ]).default("normal"),

    // For grouping related notifications
    groupKey: varchar("group_key", { length: 100 }), // e.g., "post_123_likes"

    // Scheduling
    scheduledFor: timestamp("scheduled_for"), // For delayed notifications
    sentAt: timestamp("sent_at"),

    // Expiry (for temporary notifications)
    expiresAt: timestamp("expires_at"),

    createdAt,
    updatedAt,
  },
  (table) => [
    index("notifications_recipient_id_idx").on(table.recipientId),
    index("notifications_sender_id_idx").on(table.senderId),
    index("notifications_type_idx").on(table.type),
    index("notifications_entity_idx").on(table.entityType, table.entityId),
    index("notifications_read_status_idx").on(table.isRead),
    index("notifications_priority_idx").on(table.priority),
    index("notifications_group_key_idx").on(table.groupKey),
    index("notifications_scheduled_idx").on(table.scheduledFor),
    index("notifications_expires_idx").on(table.expiresAt),
    index("notifications_created_at_idx").on(table.createdAt),

    // Composite indexes for common queries
    index("notifications_recipient_unread_idx").on(
      table.recipientId,
      table.isRead,
      table.createdAt
    ),
    index("notifications_recipient_type_idx").on(table.recipientId, table.type),
  ]
);

// Notification preferences per user
export const notificationPreferences = mysqlTable(
  "notification_preferences",
  {
    id,
    userId: userId,

    // Global settings
    enableInApp: boolean("enable_in_app").default(true),
    enableEmail: boolean("enable_email").default(true),
    enablePush: boolean("enable_push").default(true),
    enableSms: boolean("enable_sms").default(false),

    // Quiet hours (JSON for flexibility)
    quietHours: json("quiet_hours"), // { start: "22:00", end: "08:00", timezone: "Africa/Lagos" }

    // Category-specific preferences (JSON structure)
    preferences: json("preferences")
      .$default(
        () =>
          sql`JSON_OBJECT(
        'social', JSON_OBJECT(
            'likes', JSON_OBJECT('in_app', true, 'email', false, 'push', true),
            'comments', JSON_OBJECT('in_app', true, 'email', true, 'push', true),
            'follows', JSON_OBJECT('in_app', true, 'email', false, 'push', false)
        ),
        'business', JSON_OBJECT(
            'reviews', JSON_OBJECT('in_app', true, 'email', true, 'push', true),
            'orders', JSON_OBJECT('in_app', true, 'email', true, 'push', true, 'sms', true)
        ),
        'messages', JSON_OBJECT(
            'direct', JSON_OBJECT('in_app', true, 'email', false, 'push', true),
            'group', JSON_OBJECT('in_app', true, 'email', false, 'push', false)
        ),
        'system', JSON_OBJECT(
            'security', JSON_OBJECT('in_app', true, 'email', true, 'push', true, 'sms', true),
            'features', JSON_OBJECT('in_app', true, 'email', false, 'push', false)
        )
    )`
      )
      .$type<NotificationPreferences>(),
    /* Example structure:
    {
      "social": {
        "likes": { "in_app": true, "email": false, "push": true },
        "comments": { "in_app": true, "email": true, "push": true },
        "follows": { "in_app": true, "email": false, "push": false }
      },
      "business": {
        "reviews": { "in_app": true, "email": true, "push": true },
        "orders": { "in_app": true, "email": true, "push": true, "sms": true }
      },
      "messages": {
        "direct": { "in_app": true, "email": false, "push": true },
        "group": { "in_app": true, "email": false, "push": false }
      },
      "system": {
        "security": { "in_app": true, "email": true, "push": true, "sms": true },
        "features": { "in_app": true, "email": false, "push": false }
      }
    }
    */

    createdAt,
    updatedAt,
  },
  (table) => [index("notification_preferences_user_id_idx").on(table.userId)]
);

// Notification delivery tracking
export const notificationDeliveries = mysqlTable(
  "notification_deliveries",
  {
    id,
    notificationId: varchar("notification_id", { length: 36 })
      .notNull()
      .references(() => notifications.id, { onDelete: "cascade" }),
    channel: mysqlEnum("channel", ["in_app", "email", "push", "sms"]).notNull(),
    status: mysqlEnum("status", [
      "pending",
      "sent",
      "delivered",
      "failed",
      "bounced",
      "clicked",
      "opened",
    ]).default("pending"),

    // External service tracking
    externalId: varchar("external_id", { length: 255 }), // Provider's message ID
    provider: varchar("provider", { length: 50 }), // e.g., "sendgrid", "firebase", "twilio"

    // Delivery details
    attemptCount: int("attempt_count").default(1),
    lastAttemptAt: timestamp("last_attempt_at"),
    deliveredAt: timestamp("delivered_at"),
    failureReason: text("failure_reason"),

    // Engagement tracking
    openedAt: timestamp("opened_at"),
    clickedAt: timestamp("clicked_at"),

    createdAt,
    updatedAt,
  },
  (table) => [
    index("notification_deliveries_notification_id_idx").on(
      table.notificationId
    ),
    index("notification_deliveries_channel_idx").on(table.channel),
    index("notification_deliveries_status_idx").on(table.status),
    index("notification_deliveries_external_id_idx").on(table.externalId),
    index("notification_deliveries_delivered_at_idx").on(table.deliveredAt),

    // Composite for retry logic
    index("notification_deliveries_retry_idx").on(
      table.status,
      table.lastAttemptAt
    ),
  ]
);

// Notification templates (for consistent messaging)
export const notificationTemplates = mysqlTable(
  "notification_templates",
  {
    id,
    type: mysqlEnum("type", [
      "like",
      "comment",
      "reply",
      "mention",
      "follow",
      "unfollow",
      "post_shared",
      "post_featured",
      "post_approved",
      "post_rejected",
      "review_received",
      "review_reply",
      "business_verified",
      "business_suspended",
      "message_received",
      "message_reaction",
      "event_reminder",
      "event_invitation",
      "event_cancelled",
      "event_updated",
      "subscription_expiring",
      "subscription_renewed",
      "subscription_cancelled",
      "payment_successful",
      "payment_failed",
      "promotion_approved",
      "promotion_rejected",
      "promotion_budget_low",
      "promotion_completed",
      "account_warning",
      "feature_announcement",
      "maintenance_notice",
      "security_alert",
      "welcome",
    ])
      .notNull()
      .unique(),

    // Templates for different channels
    inAppTitle: varchar("in_app_title", { length: 255 }),
    inAppContent: text("in_app_content"),

    emailSubject: varchar("email_subject", { length: 255 }),
    emailContent: text("email_content"), // HTML template

    pushTitle: varchar("push_title", { length: 255 }),
    pushContent: text("push_content"),

    smsContent: text("sms_content"),

    // Template variables (JSON array)
    variables: json("variables"), // ["senderName", "postTitle", "amount", etc.]

    // Settings
    isActive: boolean("is_active").default(true),
    defaultPriority: mysqlEnum("default_priority", [
      "low",
      "normal",
      "high",
      "urgent",
    ]).default("normal"),

    createdAt,
    updatedAt,
  },
  (table) => [
    index("notification_templates_type_idx").on(table.type),
    index("notification_templates_active_idx").on(table.isActive),
  ]
);

// Notification batching for digest emails
export const notificationBatches = mysqlTable(
  "notification_batches",
  {
    id,
    userId: userId,
    batchType: mysqlEnum("batch_type", [
      "daily_digest",
      "weekly_digest",
      "monthly_digest",
      "activity_summary",
    ]).notNull(),

    status: mysqlEnum("status", [
      "pending",
      "processing",
      "sent",
      "failed",
    ]).default("pending"),

    // Batch content
    title: varchar("title", { length: 255 }),
    content: text("content"), // Generated HTML content
    notificationCount: int("notification_count").default(0),

    // Scheduling
    scheduledFor: timestamp("scheduled_for").notNull(),
    processedAt: timestamp("processed_at"),
    sentAt: timestamp("sent_at"),

    createdAt,
    updatedAt,
  },
  (table) => [
    index("notification_batches_user_id_idx").on(table.userId),
    index("notification_batches_type_idx").on(table.batchType),
    index("notification_batches_status_idx").on(table.status),
    index("notification_batches_scheduled_idx").on(table.scheduledFor),
  ]
);

// Bridge table for notifications included in batches
export const batchNotifications = mysqlTable(
  "batch_notifications",
  {
    id,
    batchId: varchar("batch_id", { length: 36 })
      .notNull()
      .references(() => notificationBatches.id, { onDelete: "cascade" }),
    notificationId: varchar("notification_id", { length: 36 })
      .notNull()
      .references(() => notifications.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [
    index("batch_notifications_batch_id_idx").on(table.batchId),
    index("batch_notifications_notification_id_idx").on(table.notificationId),
    uniqueIndex("batch_notifications_unique_idx").on(
      table.batchId,
      table.notificationId
    ),
  ]
);

// Relations
export const notificationsRelations = relations(
  notifications,
  ({ one, many }) => ({
    recipient: one(users, {
      fields: [notifications.recipientId],
      references: [users.id],
      relationName: "recipient",
    }),
    sender: one(users, {
      fields: [notifications.senderId],
      references: [users.id],
      relationName: "sender",
    }),
    deliveries: many(notificationDeliveries),
  })
);

export const notificationPreferencesRelations = relations(
  notificationPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [notificationPreferences.userId],
      references: [users.id],
    }),
  })
);

export const notificationDeliveriesRelations = relations(
  notificationDeliveries,
  ({ one }) => ({
    notification: one(notifications, {
      fields: [notificationDeliveries.notificationId],
      references: [notifications.id],
    }),
  })
);

export const notificationBatchesRelations = relations(
  notificationBatches,
  ({ one, many }) => ({
    user: one(users, {
      fields: [notificationBatches.userId],
      references: [users.id],
    }),
    batchNotifications: many(batchNotifications),
  })
);

export const batchNotificationsRelations = relations(
  batchNotifications,
  ({ one }) => ({
    batch: one(notificationBatches, {
      fields: [batchNotifications.batchId],
      references: [notificationBatches.id],
    }),
    notification: one(notifications, {
      fields: [batchNotifications.notificationId],
      references: [notifications.id],
    }),
  })
);

// Extend users relations to include notifications
export const usersNotificationRelations = relations(users, ({ one, many }) => ({
  receivedNotifications: many(notifications, { relationName: "recipient" }),
  sentNotifications: many(notifications, { relationName: "sender" }),
  notificationPreferences: one(notificationPreferences, {
    fields: [users.id],
    references: [notificationPreferences.userId],
  }),
  notificationBatches: many(notificationBatches),
}));
