import { PouchSize } from '../../users/user.types';
import { calculateTotalPriceInPence } from './calculate-total-price';

describe('calculateTotalPriceInPence', () => {
  it.each<[PouchSize, number]>([
    ['A', 5550],
    ['B', 5950],
    ['C', 6275],
    ['D', 6600],
    ['E', 6900],
    ['F', 7125],
  ])('prices pouch size %s at %i pence', (pouchSize, expected) => {
    expect(calculateTotalPriceInPence([pouchSize])).toBe(expected);
  });

  it('sums mixed pouch sizes (README example: C + F = £134.00)', () => {
    expect(calculateTotalPriceInPence(['C', 'F'])).toBe(13400);
  });

  it('sums mixed pouch sizes (README example: A + B = £115.00)', () => {
    expect(calculateTotalPriceInPence(['A', 'B'])).toBe(11500);
  });

  it('counts the same pouch size once per cat', () => {
    expect(calculateTotalPriceInPence(['A', 'A', 'A'])).toBe(16650);
  });

  it('returns 0 for no cats', () => {
    expect(calculateTotalPriceInPence([])).toBe(0);
  });
});
