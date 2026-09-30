import type { NextDeliveryResponse } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isNextDeliveryResponse(
  value: unknown,
): value is NextDeliveryResponse {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    typeof value.message === 'string' &&
    typeof value.totalPrice === 'number' &&
    typeof value.freeGift === 'boolean'
  );
}
