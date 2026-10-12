import { z } from 'zod';

/** What Cloudflare passes to the worker: vars and bindings from wrangler.jsonc, plus secrets. */
export interface Env {
  ENVIRONMENT: string;
  API_URL: string;
  /** Comma-separated web origins and app schemes allowed to call the API with cookies. */
  TRUSTED_ORIGINS: string;
  COOKIE_DOMAIN?: string;
  OTP_SENDER: string;
  TERMII_BASE_URL?: string;
  TERMII_SENDER_ID?: string;
  // Secrets: `wrangler secret put` in deployed environments, .dev.vars locally.
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  TERMII_API_KEY?: string;
  // Rate limiting bindings.
  AUTH_IP_LIMITER: RateLimit;
  OTP_PHONE_LIMITER: RateLimit;
}

const rawConfigSchema = z
  .object({
    ENVIRONMENT: z.enum(['development', 'staging', 'production']),
    API_URL: z.url(),
    TRUSTED_ORIGINS: z.string().min(1),
    COOKIE_DOMAIN: z.string().min(1).optional(),
    DATABASE_URL: z.string().startsWith('mysql://'),
    BETTER_AUTH_SECRET: z.string().min(32),
    OTP_SENDER: z.enum(['console', 'termii']),
    TERMII_BASE_URL: z.url().default('https://api.ng.termii.com'),
    TERMII_SENDER_ID: z.string().min(1).optional(),
    TERMII_API_KEY: z.string().min(1).optional(),
  })
  .refine((raw) => !(raw.ENVIRONMENT === 'production' && raw.OTP_SENDER === 'console'), {
    message: 'Production must send sign-in codes by SMS',
    path: ['OTP_SENDER'],
  })
  .refine((raw) => raw.OTP_SENDER !== 'termii' || (raw.TERMII_API_KEY && raw.TERMII_SENDER_ID), {
    message: 'The termii sender needs TERMII_API_KEY and TERMII_SENDER_ID',
    path: ['OTP_SENDER'],
  });

export type OtpConfig =
  { sender: 'console' } | { sender: 'termii'; baseUrl: string; apiKey: string; senderId: string };

export interface Config {
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  trustedOrigins: string[];
  cookieDomain?: string;
  databaseUrl: string;
  authSecret: string;
  otp: OtpConfig;
}

/** Thrown when vars or secrets are missing or invalid. Lists field names, never values. */
export class ConfigError extends Error {
  override name = 'ConfigError';
}

export function parseConfig(env: Env): Config {
  const parsed = rawConfigSchema.safeParse(env);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new ConfigError(`Invalid worker configuration. ${fields.join('; ')}`);
  }
  const raw = parsed.data;
  return {
    environment: raw.ENVIRONMENT,
    apiUrl: raw.API_URL,
    trustedOrigins: raw.TRUSTED_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    cookieDomain: raw.COOKIE_DOMAIN,
    databaseUrl: raw.DATABASE_URL,
    authSecret: raw.BETTER_AUTH_SECRET,
    otp:
      raw.OTP_SENDER === 'termii'
        ? {
            sender: 'termii',
            baseUrl: raw.TERMII_BASE_URL,
            apiKey: raw.TERMII_API_KEY ?? '',
            senderId: raw.TERMII_SENDER_ID ?? '',
          }
        : { sender: 'console' },
  };
}
