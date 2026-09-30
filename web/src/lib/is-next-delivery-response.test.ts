import { isNextDeliveryResponse } from './is-next-delivery-response';

const validResponse = {
  title: 'Your next delivery for Dorian and Ocie',
  message: 'Hey Kayleigh!',
  totalPrice: 134,
  freeGift: true,
};

describe('isNextDeliveryResponse', () => {
  it('accepts a valid response', () => {
    expect(isNextDeliveryResponse(validResponse)).toBe(true);
  });

  it('rejects null', () => {
    expect(isNextDeliveryResponse(null)).toBe(false);
  });

  it('rejects a price sent as a string', () => {
    expect(
      isNextDeliveryResponse({ ...validResponse, totalPrice: '134.00' }),
    ).toBe(false);
  });

  it('rejects a missing field', () => {
    const { title, message, totalPrice } = validResponse;
    expect(isNextDeliveryResponse({ title, message, totalPrice })).toBe(false);
  });
});
