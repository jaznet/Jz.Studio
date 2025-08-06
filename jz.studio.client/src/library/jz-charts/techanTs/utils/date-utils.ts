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
