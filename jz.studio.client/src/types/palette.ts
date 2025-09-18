// Canonical list (add/remove as you need)
export const PALETTES = ['onyx', 'emerald', 'amber', 'sky', 'rose'] as const;
export type Palette = typeof PALETTES[number]; // 'onyx' | 'emerald' | 'amber' | 'sky' | 'rose'

/** Case-insensitive, alias-friendly normalizer. Falls back to 'onyx'. */
export function normalizePalette(
  v: unknown,
  fallback: Palette = 'onyx'
): Palette {
  const s = typeof v === 'string' ? v.toLowerCase().trim() : '';
  // simple alias map (extend as needed)
  const aliases: Record<string, Palette> = {
    black: 'onyx',
    green: 'emerald',
    yellow: 'amber',
    blue: 'sky',
    red: 'rose',
  };
  const candidate = aliases[s] ?? s;
  return (PALETTES as readonly string[]).includes(candidate) ? (candidate as Palette) : fallback;
}
