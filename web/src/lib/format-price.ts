const poundsFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

/** Formats pounds for display, for example 134 as "£134.00". */
export function formatPrice(pounds: number): string {
  return poundsFormatter.format(pounds);
}
