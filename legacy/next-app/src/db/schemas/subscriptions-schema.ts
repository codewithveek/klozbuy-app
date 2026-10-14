import {
  mysqlTable,
  varchar,
  boolean,
  timestamp,
  index,
  mysqlEnum,
  text,
  decimal,
  int,
  json,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { users } from "./users-schema";
import { generateUniqueId } from "@/lib/id-generator";

const currency = varchar("currency", { length: 3 }).default("NGN");
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
export const subscriptionPlans = mysqlTable(
  "subscription_plans",
  {
    id,
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    price: decimal("price", {
      precision: 10,
      scale: 2,
      mode: "number",
    }).notNull(),
    currency,
    billingInterval: mysqlEnum("billing_interval", [
      "monthly",
      "quarterly",
      "yearly",
    ]).notNull(),
    features: json("features"), // string[]
    limits: json("limits"), // { posts: number, promotions: number, etc }
    isActive: boolean("is_active").default(true),
    sortOrder: int("sort_order").default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("subscription_plans_slug_idx").on(table.slug),
    index("subscription_plans_active_idx").on(table.isActive),
  ]
);

// User subscriptions
export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id,
    userId: userId,
    planId: varchar("plan_id", { length: 36 })
      .notNull()
      .references(() => subscriptionPlans.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", [
      "active",
      "inactive",
      "cancelled",
      "expired",
      "past_due",
    ]).notNull(),
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    cancelledAt: timestamp("cancelled_at"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_plan_id_idx").on(table.planId),
    index("subscriptions_status_idx").on(table.status),
    index("subscriptions_period_end_idx").on(table.currentPeriodEnd),
  ]
);
export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [subscriptions.planId],
    references: [subscriptionPlans.id],
  }),
}));
