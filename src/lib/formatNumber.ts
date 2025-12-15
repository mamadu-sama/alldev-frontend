/**
 * Formats a number to a compact notation (K, M, B)
 * Examples:
 * - 1000 -> 1K
 * - 1500 -> 1.5K
 * - 1000000 -> 1M
 * - 1234567 -> 1.2M
 */
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 1000000) {
    const formatted = (num / 1000).toFixed(1);
    // Remove trailing .0
    return formatted.endsWith('.0') 
      ? formatted.slice(0, -2) + 'K' 
      : formatted + 'K';
  }

  if (num < 1000000000) {
    const formatted = (num / 1000000).toFixed(1);
    return formatted.endsWith('.0')
      ? formatted.slice(0, -2) + 'M'
      : formatted + 'M';
  }

  const formatted = (num / 1000000000).toFixed(1);
  return formatted.endsWith('.0')
    ? formatted.slice(0, -2) + 'B'
    : formatted + 'B';
}

