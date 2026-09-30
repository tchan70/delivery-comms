import { formatCatNames } from './format-cat-names';

describe('formatCatNames', () => {
  it.each([
    [[], ''],
    [['Dorian'], 'Dorian'],
    [['Dorian', 'Ocie'], 'Dorian and Ocie'],
    [['Dorian', 'Ocie', 'Eldridge'], 'Dorian, Ocie and Eldridge'],
    [
      ['Dorian', 'Ocie', 'Eldridge', 'Betsy'],
      'Dorian, Ocie, Eldridge and Betsy',
    ],
  ])('formats %j as "%s"', (names: string[], expected: string) => {
    expect(formatCatNames(names)).toBe(expected);
  });
});
