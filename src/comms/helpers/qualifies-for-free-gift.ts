export const FREE_GIFT_THRESHOLD_IN_PENCE = 12000;

/** The brief says "exceeds 120 pounds", so exactly £120.00 does not qualify. */
export function qualifiesForFreeGift(totalPriceInPence: number): boolean {
  return totalPriceInPence > FREE_GIFT_THRESHOLD_IN_PENCE;
}
