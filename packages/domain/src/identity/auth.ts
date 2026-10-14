import { expo } from '@better-auth/expo';
import { nigerianPhoneSchema } from '@klozbuy/contracts';
import type { Db } from '@klozbuy/db';
import { accounts, sessions, users, verifications } from '@klozbuy/db/schema';
import { createId } from '@klozbuy/shared';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { phoneNumber } from 'better-auth/plugins/phone-number';

/** Delivers a sign-in code. The API picks SMS in production and a log line in development. */
export type OtpSender = (message: { phoneNumber: string; code: string }) => Promise<void>;

export interface AuthOptions {
  db: Db;
  secret: string;
  /** Public URL of the API worker, e.g. https://api.klozbuy.com */
  baseUrl: string;
  /** Web origins and app schemes allowed to call auth routes. */
  trustedOrigins: string[];
  /** Parent domain shared by the web app and the API, e.g. klozbuy.com. */
  cookieDomain?: string;
  /**
   * Send the session cookie with requests from another site. Only for a preview where the web
   * app and the API sit on different workers.dev hosts (a public suffix, so they are different
   * sites). Off elsewhere: SameSite=Lax is safer.
   */
  crossSiteCookies?: boolean;
  sendOtp: OtpSender;
}

const DAY_SECONDS = 24 * 60 * 60;
export const AUTH_BASE_PATH = '/v1/auth';

/** Phone sign-ups have no email yet. The .invalid domain can never receive mail. */
export const placeholderEmail = (phone: string) =>
  `p${phone.replace(/\D/g, '')}@phone.klozbuy.invalid`;

/** Sessions last 60 days; most requests are served from the signed cookie, not the database. */
const sessionOptions = {
  expiresIn: 60 * DAY_SECONDS,
  updateAge: DAY_SECONDS,
  cookieCache: { enabled: true, maxAge: 5 * 60 },
};

/**
 * Phone number sign-in with a one-time code. A new number gets an account on first
 * successful verification; the app then asks for a name.
 */
function phoneSignIn(sendOtp: OtpSender) {
  return phoneNumber({
    otpLength: 6,
    expiresIn: 5 * 60,
    allowedAttempts: 3,
    phoneNumberValidator: (phone) => nigerianPhoneSchema.safeParse(phone).success,
    sendOTP: ({ phoneNumber: phone, code }) => sendOtp({ phoneNumber: phone, code }),
    signUpOnVerification: { getTempEmail: placeholderEmail, getTempName: () => '' },
  });
}

export function createAuth(options: AuthOptions) {
  return betterAuth({
    appName: 'Klozbuy',
    secret: options.secret,
    baseURL: options.baseUrl,
    basePath: AUTH_BASE_PATH,
    trustedOrigins: options.trustedOrigins,
    database: drizzleAdapter(options.db, {
      provider: 'mysql',
      schema: { user: users, session: sessions, account: accounts, verification: verifications },
    }),
    user: {
      additionalFields: {
        role: { type: 'string', input: false, defaultValue: 'buyer' },
        consentedAt: { type: 'date', input: false, required: false },
      },
    },
    session: sessionOptions,
    // The API worker rate-limits auth routes with Cloudflare's rate limiting binding instead;
    // Better Auth's own limiter keeps counts in isolate memory, which Workers do not share.
    rateLimit: { enabled: false },
    advanced: {
      database: { generateId: () => createId() },
      crossSubDomainCookies: options.cookieDomain
        ? { enabled: true, domain: options.cookieDomain }
        : undefined,
      defaultCookieAttributes: options.crossSiteCookies
        ? { sameSite: 'none', secure: true }
        : undefined,
    },
    plugins: [phoneSignIn(options.sendOtp), expo()],
    telemetry: { enabled: false },
  });
}

export type Auth = ReturnType<typeof createAuth>;
