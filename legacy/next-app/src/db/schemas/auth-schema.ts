import {
  mysqlTable,
  varchar,
  timestamp,
  text,
  index,
} from "drizzle-orm/mysql-core";
import { users } from "./users-schema";
import { generateUniqueId } from "@/lib/id-generator";

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
export const sessions = mysqlTable(
  "sessions",
  {
    id,
    expiresAt: timestamp("expires_at").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt,
    updatedAt,
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: userId,
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_token_idx").on(table.token),
    index("sessions_expires_at_idx").on(table.expiresAt),
  ]
);

export const accounts = mysqlTable(
  "accounts",
  {
    id,
    accountId: varchar("account_id", { length: 255 }).notNull(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    userId: userId,
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("accounts_account_id_idx").on(table.accountId),
    index("accounts_provider_id_idx").on(table.providerId),
    index("accounts_user_id_idx").on(table.userId),
  ]
);

export const verifications = mysqlTable(
  "verifications",
  {
    id,
    identifier: varchar("identifier", { length: 512 }).notNull(),
    value: varchar("value", { length: 512 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("verifications_identifier_idx").on(table.identifier),
    index("verifications_value_idx").on(table.value),
    index("verifications_expires_at_idx").on(table.expiresAt),
  ]
);
