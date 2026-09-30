import { formatPrice } from './format-price';

describe('formatPrice', () => {
  it.each([
    [134, '£134.00'],
    [118.25, '£118.25'],
    [121.5, '£121.50'],
    [1234.5, '£1,234.50'],
  ])('formats %d as %s', (pounds, expected) => {
    expect(formatPrice(pounds)).toBe(expected);
  });
});
