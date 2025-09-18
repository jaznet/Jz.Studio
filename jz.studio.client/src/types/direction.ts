// Canonical list
export const DIRECTIONS = ['horizontal', 'vertical'] as const;
export type Direction = typeof DIRECTIONS[number]; // 'horizontal' | 'vertical'

/** Case-insensitive normalizer. Falls back to 'horizontal'. */
export function normalizeDirection(
  v: unknown,
  fallback: Direction = 'horizontal'
): Direction {
  const s = typeof v === 'string' ? v.toLowerCase().trim() : '';
  return s === 'vertical' ? 'vertical' : 'horizontal';
}

/** Type guard for runtime checks */
export function isDirection(v: unknown): v is Direction {
  return typeof v === 'string' &&
    (DIRECTIONS as readonly string[]).includes(v.toLowerCase());
}
