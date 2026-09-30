import { isNextDeliveryResponse } from './is-next-delivery-response';
import type { NextDeliveryResponse } from './types';

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

// Without a timeout, a hanging API would keep the page loading forever.
// When it fires, fetch rejects and error.tsx shows.
const REQUEST_TIMEOUT_MS = 5000;

/**
 * Returns null when the API rejects the ID (400) or has no delivery for it
 * (404), so the page can show "not found". Throws on anything else (5xx,
 * network failure, timeout, unexpected body) so the error boundary shows.
 */
export async function getNextDelivery(
  userId: string,
): Promise<NextDeliveryResponse | null> {
  // Server-only: no NEXT_PUBLIC_ prefix, so the value never reaches the
  // browser. Read on each call, not at import, so tests can set it.
  const apiBaseUrl = process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL;
  const url = `${apiBaseUrl}/comms/your-next-delivery/${encodeURIComponent(userId)}`;
  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (response.status === 400 || response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Next delivery request failed with ${response.status}`);
  }

  const body: unknown = await response.json();
  if (!isNextDeliveryResponse(body)) {
    throw new Error('Next delivery response has an unexpected shape');
  }
  return body;
}
