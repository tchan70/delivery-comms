import { parseUsers } from './parse-users';
import { User } from './user.types';

const validUser: User = {
  id: 'ff535484-6880-4653-b06e-89983ecf4ed5',
  firstName: 'Kayleigh',
  lastName: 'Wilderman',
  email: 'Kayleigh_Wilderman@hotmail.com',
  cats: [
    { name: 'Dorian', subscriptionActive: true, breed: 'Thai', pouchSize: 'C' },
  ],
};

describe('parseUsers', () => {
  it('returns the users when every record is valid', () => {
    expect(parseUsers([validUser])).toEqual([validUser]);
  });

  it('accepts an empty array', () => {
    expect(parseUsers([])).toEqual([]);
  });

  it('throws when the data is not an array', () => {
    expect(() => parseUsers({ users: [validUser] })).toThrow();
  });

  it('throws when a user field is missing', () => {
    const userWithoutFirstName = {
      id: validUser.id,
      lastName: validUser.lastName,
      email: validUser.email,
      cats: validUser.cats,
    };
    expect(() => parseUsers([userWithoutFirstName])).toThrow();
  });

  it('throws when a cat has an unknown pouch size', () => {
    const user = {
      ...validUser,
      cats: [{ ...validUser.cats[0], pouchSize: 'G' }],
    };
    expect(() => parseUsers([user])).toThrow();
  });

  it('throws when subscriptionActive is not a boolean', () => {
    const user = {
      ...validUser,
      cats: [{ ...validUser.cats[0], subscriptionActive: 'true' }],
    };
    expect(() => parseUsers([user])).toThrow();
  });
});
