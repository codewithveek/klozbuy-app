import { describe, expect, it } from 'vitest';
import { validateProfile, type ProfileValues } from './profile-form';

const base: ProfileValues = {
  name: 'Tunde Gadgets',
  description: '',
  whatsapp: '0803 111 0001',
  opensAt: '08:00',
  closesAt: '19:00',
  openDays: [6, 1, 2],
};

describe('validateProfile', () => {
  it('turns the form into API input with sorted days and a +234 number', () => {
    const { input } = validateProfile(base);
    expect(input).toMatchObject({
      whatsappNumber: '+2348031110001',
      hours: { openDays: [1, 2, 6] },
    });
    expect(input?.description).toBeUndefined();
  });

  it('asks for 24-hour times and open days when hours are given', () => {
    const { errors } = validateProfile({ ...base, closesAt: '7pm', openDays: [] });
    expect(errors.closesAt).toContain('24-hour');
    expect(errors.openDays).toBeDefined();
  });

  it('clears the hours when both times are empty', () => {
    const { input } = validateProfile({ ...base, opensAt: '', closesAt: '' });
    expect(input?.hours).toEqual({ opensAt: null, closesAt: null, openDays: [] });
  });
});
