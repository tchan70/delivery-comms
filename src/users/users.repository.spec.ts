import { UsersRepository } from './users.repository';

describe('UsersRepository', () => {
  const repository = new UsersRepository();

  it('loads and validates data.json', () => {
    expect(repository.findById('ff535484-6880-4653-b06e-89983ecf4ed5')).toEqual(
      expect.objectContaining({ firstName: 'Kayleigh', lastName: 'Wilderman' }),
    );
  });

  it('finds a user by an upper-case ID', () => {
    expect(repository.findById('FF535484-6880-4653-B06E-89983ECF4ED5')).toEqual(
      expect.objectContaining({ firstName: 'Kayleigh' }),
    );
  });

  it('returns undefined for an unknown ID', () => {
    expect(
      repository.findById('00000000-0000-4000-8000-000000000000'),
    ).toBeUndefined();
  });
});
