import { Cat, POUCH_SIZES, PouchSize, User } from './user.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPouchSize(value: unknown): value is PouchSize {
  return POUCH_SIZES.some((size) => size === value);
}

function isCat(value: unknown): value is Cat {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.subscriptionActive === 'boolean' &&
    typeof value.breed === 'string' &&
    isPouchSize(value.pouchSize)
  );
}

function isUser(value: unknown): value is User {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string' &&
    typeof value.email === 'string' &&
    Array.isArray(value.cats) &&
    value.cats.every(isCat)
  );
}

/**
 * Narrows untrusted JSON to User[]. Throws so that bad data fails the app at
 * startup instead of producing a broken message for one customer later.
 */
export function parseUsers(value: unknown): User[] {
  if (!Array.isArray(value) || !value.every(isUser)) {
    throw new Error('User data does not match the expected shape');
  }
  return value;
}
