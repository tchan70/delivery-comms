import { Cat } from '../../users/user.types';
import { NextDeliveryResponse } from '../comms.types';
import { calculateTotalPriceInPence } from './calculate-total-price';
import { formatCatNames } from './format-cat-names';
import { penceToPounds } from './pence-to-pounds';
import { qualifiesForFreeGift } from './qualifies-for-free-gift';

/**
 * Fills the "your next delivery" template. Expects only active cats, and at
 * least one: CommsService filters them and returns 404 when there are none.
 */
export function buildNextDeliveryComms(
  firstName: string,
  activeCats: readonly Cat[],
): NextDeliveryResponse {
  const catNames = formatCatNames(activeCats.map((cat) => cat.name));
  const totalPriceInPence = calculateTotalPriceInPence(
    activeCats.map((cat) => cat.pouchSize),
  );

  return {
    title: `Your next delivery for ${catNames}`,
    message: `Hey ${firstName}! In two days' time, we'll be charging you for your next order for ${catNames}'s fresh food.`,
    totalPrice: penceToPounds(totalPriceInPence),
    freeGift: qualifiesForFreeGift(totalPriceInPence),
  };
}
