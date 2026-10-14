import type { OtpSender } from '@klozbuy/domain/identity';
import type { OtpConfig } from './env';

export const otpMessage = (code: string) =>
  `${code} is your Klozbuy code. It expires in 5 minutes. Never share it with anyone.`;

/** Development only: parseConfig refuses this sender in production. */
const consoleSender: OtpSender = async ({ phoneNumber, code }) => {
  console.info(`Sign-in code for ${phoneNumber}: ${code} (not sent; OTP_SENDER is console)`);
};

function termiiSender(config: Extract<OtpConfig, { sender: 'termii' }>): OtpSender {
  return async ({ phoneNumber, code }) => {
    const response = await fetch(new URL('/api/sms/send', config.baseUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: config.apiKey,
        to: phoneNumber.replace(/^\+/, ''),
        from: config.senderId,
        sms: otpMessage(code),
        type: 'plain',
        // The DND route reaches numbers that block promotional SMS.
        channel: 'dnd',
      }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error(`Termii did not accept the SMS (status ${response.status})`);
  };
}

export function createOtpSender(config: OtpConfig): OtpSender {
  return config.sender === 'termii' ? termiiSender(config) : consoleSender;
}
