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

/**
 * Optional knobs you can pass from the render service if you ever want
 * hover/pressed to subtly change “finish” without changing archetype.
 */
export type JzButtonMaterialOverrides = Partial<{
  roughness: number;
  metalness: number;

  clearcoat: number;
  clearcoatRoughness: number;
  sheen: number;
  sheenRoughness: number;
  sheenColor: string;

  specularIntensity: number;
  specularColor: string;

  ior: number;
  transmission: number;
  thickness: number;

  // for plastic-like subsurface feel (very subtle)
  attenuationColor: string;
  attenuationDistance: number;

  // For stronger bevel “pop”
  normalScale: number; // (only used if you add a normal map later)
}>;

export function normalizeHex(hex: string): string {
  const h = (hex ?? "").trim();
  if (!h) return "#000000";
  return h.startsWith("#") ? h : `#${h}`;
}

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

/**
 * Returns a MeshPhysicalMaterial tuned for small glossy-ish objects
 * where bevels should read well under directional lighting.
 *
 * IMPORTANT: the returned material is safe to cache & reuse.
 */
export function buildMaterialPreset(
  archetype: JzButtonMaterialArchetype,
  baseHex: string,
  overrides: JzButtonMaterialOverrides = {}
): { mat: THREE.MeshPhysicalMaterial } {
  const base = new THREE.Color(normalizeHex(baseHex));

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

    // Helps reduce edge “crush” in dark colors (subtle, but nice)
    attenuationColor: new THREE.Color(baseHex),
    attenuationDistance: 0.0,
  };

  // --- Archetype tuning ---
  // Goal: bevel catches light, face stays calm, no “plastic toy” glare unless requested
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
      // a hint of depth for dark plastics
      common.attenuationDistance = 0.15;
      break;

    case "ceramicSatin":
      common.metalness = 0.0;
      common.roughness = 0.28;
      common.clearcoat = 0.35;
      common.clearcoatRoughness = 0.18;
      common.specularIntensity = 0.80;
      common.ior = 1.52;
      // ceramic often has a “soft cloth” micro-sheen
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
  if (overrides.clearcoatRoughness != null) mat.clearcoatRoughness = clamp01(overrides.clearcoatRoughness);

  if (overrides.sheen != null) mat.sheen = clamp01(overrides.sheen);
  if (overrides.sheenRoughness != null) mat.sheenRoughness = clamp01(overrides.sheenRoughness);
  if (overrides.sheenColor != null) mat.sheenColor = new THREE.Color(normalizeHex(overrides.sheenColor));

  if (overrides.specularIntensity != null) mat.specularIntensity = clamp01(overrides.specularIntensity);
  if (overrides.specularColor != null) mat.specularColor = new THREE.Color(normalizeHex(overrides.specularColor));

  if (overrides.ior != null) mat.ior = Math.max(1.0, overrides.ior);
  if (overrides.transmission != null) mat.transmission = clamp01(overrides.transmission);
  if (overrides.thickness != null) mat.thickness = Math.max(0, overrides.thickness);

  if (overrides.attenuationColor != null) mat.attenuationColor = new THREE.Color(normalizeHex(overrides.attenuationColor));
  if (overrides.attenuationDistance != null) mat.attenuationDistance = Math.max(0, overrides.attenuationDistance);

  // Performance: you’re not using maps right now; keep it lean.
  mat.needsUpdate = false;
  return { mat };
}
