import { penceToPounds } from './pence-to-pounds';

describe('penceToPounds', () => {
  it.each([
    [13400, 134],
    [11825, 118.25],
    [7125, 71.25],
    [0, 0],
  ])('converts %i pence to %d pounds', (pence, expected) => {
    expect(penceToPounds(pence)).toBe(expected);
  });
});
