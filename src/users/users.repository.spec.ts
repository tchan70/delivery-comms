import { UsersRepository } from './users.repository';

describe('UsersRepository', () => {
  const repository = new UsersRepository();

  it('loads and validates data.json', () => {
    expect(repository.findById('ff535484-6880-4653-b06e-89983ecf4ed5')).toEqual(
      expect.objectContaining({ firstName: 'Kayleigh', lastName: 'Wilderman' }),
    );
  });

  it('returns undefined for an unknown ID', () => {
    expect(
      repository.findById('00000000-0000-4000-8000-000000000000'),
    ).toBeUndefined();
  });
});
