// palette.ts

/** Canonical palette keys (must match PaletteMgrService switch cases) */
export const PALETTES = [
  'licorice',
  'feldgrau',
  'gunmetal',
  'charts',
  'hooker',
  'default',
  'dune',
  'gold',
  'indigo',
  'bistre',
  'welcome',
  'gray',
  'olive',
  'xyno',
  'liver',
  'oxford',
  'indigo2',
  'red',
  'coffee',
  'jungle',
  'findash', // present as a case label in your service
] as const;

export type Palette = typeof PALETTES[number];

/** Quick membership guard */
export function isPalette(v: string): v is Palette {
  return (PALETTES as readonly string[]).includes(v as Palette);
}

/** Normalize user input to a canonical palette key. */
export function normalizePalette(
  v: unknown,
  fallback: Palette = 'feldgrau'
): Palette {
  if (typeof v !== 'string') return fallback;

  // Base normalization
  const raw = v.trim().toLowerCase();

  // Collapse common separators and spaces: "gun metal", "gun-metal", "gun_metal" -> "gunmetal"
  const collapsed = raw.replace(/[\s_\-]+/g, '');

  // Aliases (left side can include spaces; we check both raw and collapsed)
  const aliases: Record<string, Palette> = {
    black: 'feldgrau',
    dark: 'feldgrau',

    // common typos or friendly names
    'gun metal': 'gunmetal',
    gunmetal: 'gunmetal',

    charcoal: 'feldgrau',
    coffee: 'coffee',
    java: 'coffee',

    gold: 'gold',
    golden: 'gold',

    olive: 'olive',
    jungle: 'jungle',

    indigo: 'indigo',
    'indigo 2': 'indigo2',
    indigo2: 'indigo2',

    licorice: 'licorice',
    feldgrau: 'feldgrau',
    charts: 'charts',
    hooker: 'hooker',
    default: 'default',
    dune: 'dune',
    bistre: 'bistre',
    welcome: 'welcome',
    grey: 'gray', // UK spelling
    gray: 'gray',
    xyno: 'xyno',
    liver: 'liver',
    oxford: 'oxford',
    red: 'red',
    findash: 'findash',
  };

  const candidate = aliases[raw] ?? aliases[collapsed] ?? collapsed;

  return isPalette(candidate) ? (candidate as Palette) : fallback;
}
