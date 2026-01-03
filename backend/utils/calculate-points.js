/**
 * Converts status into earned points for a requirement weight.
 */
export function calculatePoints(weight, status) {
  const multiplier = status === 'PASS' ? 1.0 : status === 'PARTIAL' ? 0.5 : 0.0;
  return Math.round(weight * 100 * multiplier * 10) / 10;
}