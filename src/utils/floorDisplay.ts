/**
 * Returns floor number as ordinal display string, e.g. "10th Floor", "Ground Floor".
 */
export function getFloorDisplayName(floor: number): string {
  if (floor === 0) return "Ground Floor";
  const n = floor;
  const last = n % 10;
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th Floor`;
  if (last === 1) return `${n}st Floor`;
  if (last === 2) return `${n}nd Floor`;
  if (last === 3) return `${n}rd Floor`;
  return `${n}th Floor`;
}
