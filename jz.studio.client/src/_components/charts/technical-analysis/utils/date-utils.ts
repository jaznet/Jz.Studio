// techants/utils/date-utils.ts

/**
 * Safely converts a Date or string to an ISO string.
 * Returns an empty string if input is invalid.
 */
export function toISOStringSafe(value: Date | string): string {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString();
  }

  const parsed = new Date(value);
  return !isNaN(parsed.getTime()) ? parsed.toISOString() : '';
}


// Coerce many shapes into a real Date.
// If it can’t be parsed, return an invalid Date (NaN time).
export function asDate(v: Date | string | number | null | undefined): Date {
  if (v instanceof Date) return v;
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date(NaN); // caller can guard/fallback if needed
}

