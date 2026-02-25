// palette.ts

/** Canonical palette keys (must match PaletteMgrService switch cases) */
export const PALETTES = [
  'protan',
  'protan2',
  'coffee',


] as const;

export type Palette = typeof PALETTES[number];

/** Quick membership guard */
export function isPalette(v: string): v is Palette {
  return (PALETTES as readonly string[]).includes(v as Palette);
}

/** Normalize user input to a canonical palette key. */
export function normalizePalette(
  v: unknown,
  fallback: Palette = 'coffee'
): Palette {
  if (typeof v !== 'string') return fallback;

  // Base normalization
  const raw = v.trim().toLowerCase();

  // Collapse common separators and spaces: "gun metal", "gun-metal", "gun_metal" -> "gunmetal"
  const collapsed = raw.replace(/[\s_\-]+/g, '');

  // Aliases (left side can include spaces; we check both raw and collapsed)
  const aliases: Record<string, Palette> = {
    protan: 'protan',
    protan2: 'protan2',
    coffee: 'coffee',
  };

  const candidate = aliases[raw] ?? aliases[collapsed] ?? collapsed;

  return isPalette(candidate) ? (candidate as Palette) : fallback;
}
