/** Joins names as "A", "A and B", or "A, B and C" (no Oxford comma, per the brief). */
export function formatCatNames(names: readonly string[]): string {
  if (names.length === 0) {
    return '';
  }
  if (names.length === 1) {
    return names[0];
  }
  const allButLast = names.slice(0, -1).join(', ');
  const last = names[names.length - 1];
  return `${allButLast} and ${last}`;
}
