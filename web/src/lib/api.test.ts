/**
 * @jest-environment node
 */
import { getNextDelivery } from './api';
import type { NextDeliveryResponse } from './types';

const userId = 'ff535484-6880-4653-b06e-89983ecf4ed5';
const apiBaseUrlFromShell = process.env.API_BASE_URL;

const delivery: NextDeliveryResponse = {
  title: 'Your next delivery for Dorian and Ocie',
  message: 'Hey Kayleigh!',
  totalPrice: 134,
  freeGift: true,
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status });
}

describe('getNextDelivery', () => {
  // Fix the base URL, so the tests pass whatever API_BASE_URL the shell has.
  beforeEach(() => {
    process.env.API_BASE_URL = 'http://api.test';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    if (apiBaseUrlFromShell === undefined) {
      delete process.env.API_BASE_URL;
    } else {
      process.env.API_BASE_URL = apiBaseUrlFromShell;
    }
  });

  it('returns the delivery for a 200 response', async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(jsonResponse(delivery, 200));

    await expect(getNextDelivery(userId)).resolves.toEqual(delivery);
    expect(fetchSpy).toHaveBeenCalledWith(
      `http://api.test/comms/your-next-delivery/${userId}`,
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('uses http://localhost:3000 when API_BASE_URL is not set', async () => {
    delete process.env.API_BASE_URL;
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(jsonResponse(delivery, 200));

    await getNextDelivery(userId);

    expect(fetchSpy).toHaveBeenCalledWith(
      `http://localhost:3000/comms/your-next-delivery/${userId}`,
      expect.anything(),
    );
  });

  it('encodes the user ID so it cannot change the API path', async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(jsonResponse(delivery, 200));

    await getNextDelivery('../admin');

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://api.test/comms/your-next-delivery/..%2Fadmin',
      expect.anything(),
    );
  });

  it.each([400, 404])('returns null for a %i response', async (status) => {
    jest.spyOn(global, 'fetch').mockResolvedValue(jsonResponse({}, status));

    await expect(getNextDelivery(userId)).resolves.toBeNull();
  });

  it('throws for a 5xx response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(jsonResponse({}, 503));

    await expect(getNextDelivery(userId)).rejects.toThrow('503');
  });

  it('throws when the body has an unexpected shape', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(jsonResponse({ ...delivery, totalPrice: '134' }, 200));

    await expect(getNextDelivery(userId)).rejects.toThrow('unexpected shape');
  });

  it('passes a 5 second timeout signal and throws when it fires', async () => {
    const timeoutSpy = jest.spyOn(AbortSignal, 'timeout');
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockRejectedValue(
        new DOMException(
          'The operation was aborted due to timeout',
          'TimeoutError',
        ),
      );

    await expect(getNextDelivery(userId)).rejects.toThrow('timeout');
    expect(timeoutSpy).toHaveBeenCalledWith(5000);
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: timeoutSpy.mock.results[0].value }),
    );
  });
});
