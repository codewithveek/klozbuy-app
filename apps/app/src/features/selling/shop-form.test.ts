import { describe, expect, it } from 'vitest';
import { validateShopForm } from './shop-form';

const valid = {
  name: 'Tunde Gadgets',
  categoryId: 'cphones000000000',
  whatsapp: '0803 123 4567',
  landmark: 'Opposite Yaba bus stop',
  point: { lat: 6.5095, lng: 3.3711 },
};

describe('validateShopForm', () => {
  it('builds the API input with an international number', () => {
    const { input, errors } = validateShopForm(valid);
    expect(errors).toEqual({});
    expect(input).toMatchObject({
      whatsappNumber: '+2348031234567',
      location: { landmark: 'Opposite Yaba bus stop' },
    });
  });

  it('explains every missing field', () => {
    const { input, errors } = validateShopForm({ name: '', whatsapp: '123', landmark: '' });
    expect(input).toBeUndefined();
    expect(Object.keys(errors).sort()).toEqual([
      'categoryId',
      'landmark',
      'name',
      'point',
      'whatsapp',
    ]);
  });
});
