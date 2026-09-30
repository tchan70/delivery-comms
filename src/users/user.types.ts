export const POUCH_SIZES = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export type PouchSize = (typeof POUCH_SIZES)[number];

export interface Cat {
  name: string;
  subscriptionActive: boolean;
  breed: string;
  pouchSize: PouchSize;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cats: Cat[];
}
