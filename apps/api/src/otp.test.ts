import { afterEach, describe, expect, it, vi } from 'vitest';
import { createOtpSender, otpMessage } from './otp';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Termii sender', () => {
  const config = {
    sender: 'termii',
    baseUrl: 'https://api.ng.termii.com',
    apiKey: 'test-key',
    senderId: 'Klozbuy',
  } as const;

  it('sends the code over the DND route without the plus sign', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await createOtpSender(config)({ phoneNumber: '+2348012345678', code: '123456' });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [URL, RequestInit];
    expect(url.toString()).toBe('https://api.ng.termii.com/api/sms/send');
    expect(JSON.parse(String(init.body))).toMatchObject({
      to: '2348012345678',
      from: 'Klozbuy',
      channel: 'dnd',
      sms: otpMessage('123456'),
    });
  });

  it('fails when Termii refuses, so the app can show an error', async () => {
    vi.stubGlobal('fetch', async () => new Response('{}', { status: 401 }));
    await expect(
      createOtpSender(config)({ phoneNumber: '+2348012345678', code: '123456' }),
    ).rejects.toThrow(/401/);
  });
});
