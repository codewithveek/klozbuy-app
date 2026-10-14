import { describe, expect, it } from 'vitest';
import { ConfigError, parseConfig } from './env';
import { testEnv } from './test-env';

describe('parseConfig', () => {
  it('splits trusted origins and defaults to the console sender', () => {
    const config = parseConfig(testEnv());
    expect(config.trustedOrigins).toEqual(['http://localhost:8081', 'klozbuy://']);
    expect(config.otp).toEqual({ sender: 'console' });
  });

  it('refuses the console sender in production', () => {
    expect(() => parseConfig(testEnv({ ENVIRONMENT: 'production' }))).toThrow(ConfigError);
  });

  it('requires Termii credentials for the SMS sender', () => {
    expect(() => parseConfig(testEnv({ OTP_SENDER: 'termii' }))).toThrow(/TERMII_API_KEY/);
    const config = parseConfig(
      testEnv({ OTP_SENDER: 'termii', TERMII_API_KEY: 'key', TERMII_SENDER_ID: 'Klozbuy' }),
    );
    expect(config.otp).toMatchObject({ sender: 'termii', baseUrl: 'https://api.ng.termii.com' });
  });

  it('sends cross-site cookies only when asked to', () => {
    expect(parseConfig(testEnv()).crossSiteCookies).toBe(false);
    expect(parseConfig(testEnv({ CROSS_SITE_COOKIES: 'true' })).crossSiteCookies).toBe(true);
  });

  it('names invalid fields without echoing their values', () => {
    const secret = 'mysql-but-wrong-scheme://secret-password@host/db';
    expect(() => parseConfig(testEnv({ DATABASE_URL: secret }))).toThrow(/DATABASE_URL/);
    expect(() => parseConfig(testEnv({ DATABASE_URL: secret }))).not.toThrow(/secret-password/);
  });
});
