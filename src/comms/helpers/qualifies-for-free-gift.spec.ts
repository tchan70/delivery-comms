import { qualifiesForFreeGift } from './qualifies-for-free-gift';

describe('qualifiesForFreeGift', () => {
  it.each([
    [11999, false],
    [12000, false],
    [12001, true],
  ])('%i pence qualifies: %s', (totalPriceInPence, expected) => {
    expect(qualifiesForFreeGift(totalPriceInPence)).toBe(expected);
  });
});
