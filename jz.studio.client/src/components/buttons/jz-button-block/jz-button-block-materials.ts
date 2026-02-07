// jz-button-block-materials.ts
import * as THREE from "three";

export type JzButtonMaterialArchetype =
  | "bakeliteSatin"
  | "bakeliteGloss"
  | "softPlastic"
  | "ceramicSatin"
  | "anodizedMetal"
  | "polishedMetal"
  | "lacquered";

export type JzButtonBlockFinish =
  | "matte"
  | "anodized"
  | "glossy"
  | JzButtonMaterialArchetype;

/**
 * Optional knobs you can pass from the render service if you ever want
 * hover/pressed to subtly change “finish” without changing archetype.
 *
 * IMPORTANT: If you want a different look, pass overrides into
 * getOrCreateMaterialPreset(...) — do NOT mutate the returned material
 * (it's shared via cache).
 */
export type JzButtonMaterialOverrides = Partial<{
  roughness: number;
  metalness: number;

  clearcoat: number;
  clearcoatRoughness: number;
  sheen: number;
  sheenRoughness: number;
  sheenColor: string | number;

  specularIntensity: number;
  specularColor: string | number;

  ior: number;
  transmission: number;
  thickness: number;

  // for plastic-like subsurface feel (very subtle)
  attenuationColor: string | number;
  attenuationDistance: number;

  // Optional debug/perf knobs
  envMapIntensity: number;
  side: THREE.Side;

  // For stronger bevel “pop”
  normalScale: number; // (only used if you add a normal map later)
}>;

/**
 * Normalize hex input for stable keys + consistent color creation.
 * Returns a 6-char, lowercase hex string WITHOUT '#'.
 * Accepts "#RRGGBB", "RRGGBB", "#RGB", "RGB", or 0xRRGGBB number.
 */
export function normalizeHex(hex: string | number): string {
  if (typeof hex === "number") return (hex >>> 0).toString(16).padStart(6, "0").toLowerCase();

  const s = (hex ?? "").trim().toLowerCase();
  if (!s) return "000000";

  const raw = s.startsWith("#") ? s.slice(1) : s;

  // Support shorthand #rgb -> rrggbb
  if (raw.length === 3) {
    const r = raw[0] ?? "0";
    const g = raw[1] ?? "0";
    const b = raw[2] ?? "0";
    return `${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return raw.padStart(6, "0").slice(0, 6).toLowerCase();
}

function hexForThree(hex: string | number): string {
  return `#${normalizeHex(hex)}`;
}

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

/** keep cache keys stable when floats vary at tiny epsilon levels */
function round3(n: number): string {
  return (Math.round(n * 1000) / 1000).toFixed(3);
}

/**
 * Map simple finishes to an archetype so your switch(...) always hits.
 */
export function resolveFinishToArchetype(finish: JzButtonBlockFinish): JzButtonMaterialArchetype {
  switch (finish) {
    case "matte":
      return "softPlastic";
    case "anodized":
      return "anodizedMetal";
    case "glossy":
      return "lacquered";
    default:
      return finish;
  }
}

// --- Simple, stable cache ---
const materialCache = new Map<string, THREE.MeshPhysicalMaterial>();

function stableKeyFromOverrides(o: JzButtonMaterialOverrides): string {
  // Stable ordering; include only fields that affect output.
  const parts: string[] = [];

  if (o.roughness != null) parts.push(`r=${round3(clamp01(o.roughness))}`);
  if (o.metalness != null) parts.push(`m=${round3(clamp01(o.metalness))}`);

  if (o.clearcoat != null) parts.push(`cc=${round3(clamp01(o.clearcoat))}`);
  if (o.clearcoatRoughness != null)
    parts.push(`ccr=${round3(clamp01(o.clearcoatRoughness))}`);

  if (o.sheen != null) parts.push(`sh=${round3(clamp01(o.sheen))}`);
  if (o.sheenRoughness != null)
    parts.push(`shr=${round3(clamp01(o.sheenRoughness))}`);
  if (o.sheenColor != null) parts.push(`shc=${normalizeHex(o.sheenColor)}`);

  if (o.specularIntensity != null)
    parts.push(`si=${round3(clamp01(o.specularIntensity))}`);
  if (o.specularColor != null) parts.push(`sc=${normalizeHex(o.specularColor)}`);

  if (o.ior != null) parts.push(`ior=${round3(Math.max(1.0, o.ior))}`);
  if (o.transmission != null)
    parts.push(`tr=${round3(clamp01(o.transmission))}`);
  if (o.thickness != null) parts.push(`th=${round3(Math.max(0, o.thickness))}`);

  if (o.attenuationColor != null) parts.push(`ac=${normalizeHex(o.attenuationColor)}`);
  if (o.attenuationDistance != null)
    parts.push(`ad=${round3(Math.max(0, o.attenuationDistance))}`);

  if (o.envMapIntensity != null) parts.push(`emi=${round3(Math.max(0, o.envMapIntensity))}`);
  if (o.side != null) parts.push(`side=${o.side}`);

  // normalScale doesn't do anything unless you add a normal map,
  // but keeping it here lets you vary cache keys when that day comes.
  if (o.normalScale != null) parts.push(`ns=${round3(o.normalScale)}`);

  return parts.join("|");
}

function materialKey(
  archetype: JzButtonMaterialArchetype,
  baseHex: string | number,
  overrides: JzButtonMaterialOverrides
): string {
  const o = stableKeyFromOverrides(overrides);
  const base = normalizeHex(baseHex);
  return o ? `a=${archetype}|c=${base}|${o}` : `a=${archetype}|c=${base}`;
}

/**
 * Use this from your render service.
 * - Accepts either the simple finish ("matte/anodized/glossy") OR a concrete archetype.
 * - Caches materials by (archetype + base color + overrides).
 */
export function getOrCreateMaterialPreset(
  finish: JzButtonBlockFinish,
  baseHex: string | number,
  overrides: JzButtonMaterialOverrides = {}
): { mat: THREE.MeshPhysicalMaterial; archetype: JzButtonMaterialArchetype; key: string } {
  const archetype = resolveFinishToArchetype(finish);
  const key = materialKey(archetype, baseHex, overrides);

  const cached = materialCache.get(key);
  if (cached) return { mat: cached, archetype, key };

  const { mat } = buildMaterialPreset(archetype, baseHex, overrides);
  materialCache.set(key, mat);

  return { mat, archetype, key };
}

/**
 * Returns a MeshPhysicalMaterial tuned for small glossy-ish objects
 * where bevels should read well under directional lighting.
 *
 * IMPORTANT: returned material is safe to cache & reuse AS-LONG-AS you don't mutate it afterward.
 */
export function buildMaterialPreset(
  archetype: JzButtonMaterialArchetype,
  baseHex: string | number,
  overrides: JzButtonMaterialOverrides = {}
): { mat: THREE.MeshPhysicalMaterial } {
  const base = new THREE.Color(hexForThree(baseHex));

  // --- Defaults that work well for your “button block” ---
  // A tiny specular boost helps bevels pop even on darker colors.
  const common: THREE.MeshPhysicalMaterialParameters = {
    color: base,
    metalness: 0.0,
    roughness: 0.45,

    // MeshPhysical extras
    ior: 1.45,
    specularIntensity: 0.55,
    specularColor: new THREE.Color("#ffffff"),

    // These stay off unless archetype enables them
    clearcoat: 0.0,
    clearcoatRoughness: 0.2,

    sheen: 0.0,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color("#ffffff"),

    transmission: 0.0,
    thickness: 0.0,

    // Helps reduce edge “crush” in dark colors (subtle)
    attenuationColor: new THREE.Color(hexForThree(baseHex)),
    attenuationDistance: 0.0,

    // Optional knobs (safe defaults)
    envMapIntensity: 1.0,
    side: THREE.FrontSide,
  };

  // --- Archetype tuning ---
  switch (archetype) {
    case "bakeliteSatin":
      common.metalness = 0.0;
      common.roughness = 0.35;
      common.clearcoat = 0.55;
      common.clearcoatRoughness = 0.25;
      common.specularIntensity = 0.65;
      common.ior = 1.55;
      break;

    case "bakeliteGloss":
      common.metalness = 0.0;
      common.roughness = 0.18;
      common.clearcoat = 0.9;
      common.clearcoatRoughness = 0.10;
      common.specularIntensity = 0.85;
      common.ior = 1.60;
      break;

    case "softPlastic":
      common.metalness = 0.0;
      common.roughness = 0.65;
      common.clearcoat = 0.15;
      common.clearcoatRoughness = 0.55;
      common.specularIntensity = 0.45;
      common.ior = 1.42;
      common.attenuationDistance = 0.15;
      break;

    case "ceramicSatin":
      common.metalness = 0.0;
      common.roughness = 0.28;
      common.clearcoat = 0.35;
      common.clearcoatRoughness = 0.18;
      common.specularIntensity = 0.80;
      common.ior = 1.52;
      common.sheen = 0.15;
      common.sheenRoughness = 0.55;
      common.sheenColor = new THREE.Color("#ffffff");
      break;

    case "anodizedMetal":
      common.metalness = 1.0;
      common.roughness = 0.35;
      common.clearcoat = 0.25;
      common.clearcoatRoughness = 0.28;
      common.specularIntensity = 0.35; // metals already reflect via metalness
      common.ior = 1.50;
      break;

    case "polishedMetal":
      common.metalness = 1.0;
      common.roughness = 0.10;
      common.clearcoat = 0.0;
      common.specularIntensity = 0.25;
      common.ior = 1.50;
      break;

    case "lacquered":
      common.metalness = 0.0;
      common.roughness = 0.25;
      common.clearcoat = 1.0;
      common.clearcoatRoughness = 0.12;
      common.specularIntensity = 0.80;
      common.ior = 1.60;
      break;
  }

  // --- Apply overrides safely ---
  const mat = new THREE.MeshPhysicalMaterial(common);

  if (overrides.roughness != null) mat.roughness = clamp01(overrides.roughness);
  if (overrides.metalness != null) mat.metalness = clamp01(overrides.metalness);

  if (overrides.clearcoat != null) mat.clearcoat = clamp01(overrides.clearcoat);
  if (overrides.clearcoatRoughness != null)
    mat.clearcoatRoughness = clamp01(overrides.clearcoatRoughness);

  if (overrides.sheen != null) mat.sheen = clamp01(overrides.sheen);
  if (overrides.sheenRoughness != null)
    mat.sheenRoughness = clamp01(overrides.sheenRoughness);
  if (overrides.sheenColor != null)
    mat.sheenColor = new THREE.Color(hexForThree(overrides.sheenColor));

  if (overrides.specularIntensity != null)
    mat.specularIntensity = clamp01(overrides.specularIntensity);
  if (overrides.specularColor != null)
    mat.specularColor = new THREE.Color(hexForThree(overrides.specularColor));

  if (overrides.ior != null) mat.ior = Math.max(1.0, overrides.ior);
  if (overrides.transmission != null)
    mat.transmission = clamp01(overrides.transmission);
  if (overrides.thickness != null) mat.thickness = Math.max(0, overrides.thickness);

  if (overrides.attenuationColor != null)
    mat.attenuationColor = new THREE.Color(hexForThree(overrides.attenuationColor));
  if (overrides.attenuationDistance != null)
    mat.attenuationDistance = Math.max(0, overrides.attenuationDistance);

  if (overrides.envMapIntensity != null)
    mat.envMapIntensity = Math.max(0, overrides.envMapIntensity);
  if (overrides.side != null) mat.side = overrides.side;

  return { mat };
}

/**
 * Optional: clear cache (useful during HMR). Dispose to avoid GPU leaks.
 */
export function clearMaterialCache(dispose = true): void {
  if (dispose) {
    materialCache.forEach((m) => m.dispose());
  }
  materialCache.clear();
}

export function getMaterialCacheSize(): number {
  return materialCache.size;
}
