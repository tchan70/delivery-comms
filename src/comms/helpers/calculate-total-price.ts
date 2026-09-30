import { PouchSize } from '../../users/user.types';

// Integer pence avoids floating-point errors such as 0.1 + 0.2 !== 0.3.
// Record<PouchSize, number> makes the compiler reject a pouch size with no price.
export const POUCH_PRICES_IN_PENCE: Record<PouchSize, number> = {
  A: 5550,
  B: 5950,
  C: 6275,
  D: 6600,
  E: 6900,
  F: 7125,
};

export function calculateTotalPriceInPence(
  pouchSizes: readonly PouchSize[],
): number {
  return pouchSizes.reduce(
    (total, pouchSize) => total + POUCH_PRICES_IN_PENCE[pouchSize],
    0,
  );
}
