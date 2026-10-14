import { USER_ROLES } from '@klozbuy/contracts';
import { boolean, index, mysqlTable, text, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { id, primaryId, timestamps, utcDatetime } from '../columns';

/**
 * Identity module. The first four tables follow Better Auth's model (keys must keep
 * Better Auth's field names); IDs come from createId through Better Auth's generateId.
 */
export const users = mysqlTable(
  'users',
  {
    id: primaryId(),
    name: varchar({ length: 100 }).notNull(),
    /** Better Auth requires an email; phone sign-ups get a placeholder until they add one. */
    email: varchar({ length: 255 }).notNull(),
    emailVerified: boolean().notNull().default(false),
    image: varchar({ length: 500 }),
    phoneNumber: varchar({ length: 16 }),
    phoneNumberVerified: boolean().notNull().default(false),
    role: varchar({ length: 16, enum: USER_ROLES }).notNull().default('buyer'),
    /** When the user agreed to the privacy notice (Nigeria Data Protection Act). */
    consentedAt: utcDatetime(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('users_phone_number_uq').on(t.phoneNumber),
    uniqueIndex('users_email_uq').on(t.email),
  ],
);

/** Only used when sessions are also kept in the database; KV holds them by default. */
export const sessions = mysqlTable(
  'sessions',
  {
    id: primaryId(),
    userId: id().notNull(),
    token: varchar({ length: 255 }).notNull(),
    expiresAt: utcDatetime().notNull(),
    ipAddress: varchar({ length: 45 }),
    userAgent: varchar({ length: 500 }),
    ...timestamps,
  },
  (t) => [uniqueIndex('sessions_token_uq').on(t.token), index('sessions_user_idx').on(t.userId)],
);

export const accounts = mysqlTable(
  'accounts',
  {
    id: primaryId(),
    userId: id().notNull(),
    accountId: varchar({ length: 255 }).notNull(),
    providerId: varchar({ length: 64 }).notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: utcDatetime(),
    refreshTokenExpiresAt: utcDatetime(),
    scope: varchar({ length: 500 }),
    password: varchar({ length: 255 }),
    ...timestamps,
  },
  (t) => [index('accounts_user_idx').on(t.userId)],
);

/** One-time codes, including the phone sign-in OTP. */
export const verifications = mysqlTable(
  'verifications',
  {
    id: primaryId(),
    identifier: varchar({ length: 255 }).notNull(),
    value: varchar({ length: 255 }).notNull(),
    expiresAt: utcDatetime().notNull(),
    ...timestamps,
  },
  (t) => [index('verifications_identifier_idx').on(t.identifier)],
);
