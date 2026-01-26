// jz-button-block-materials.ts
// Material archetypes (presets) with a small amount of "auto-tuning" so
// dark AND light colors both read well under the same light rig.
//
// Notes:
// - Most presets are SINGLE-lobe (no clearcoat) for predictable highlights.
// - Lacquered is the only default that uses clearcoat.
// - A tiny luminance-aware tuning keeps light colors from blowing out and
//   dark colors from going dead, without changing the “identity” of the preset.

import * as THREE from "three";

export type JzButtonMaterialArchetype =
  | "bakeliteSatin"
  | "bakeliteGloss"
  | "ceramicSoft"
  | "rubberMatte"
  | "anodizedMetal"
  | "polishedMetal"
  | "lacquered";

export type MaterialBuild = {
  mat: THREE.Material;
};

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

/** Relative luminance (0..1) using linearized sRGB */
function luminance01_srgb(hex: string): number {
  const c = new THREE.Color(hex);

  const srgbToLinear = (u: number) =>
    u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);

  // THREE.Color components are stored in linear for modern three *in many paths*,
  // but this defensive conversion keeps tuning stable even if upstream changes.
  const r = srgbToLinear(c.r);
  const g = srgbToLinear(c.g);
  const b = srgbToLinear(c.b);

  return clamp01(0.2126 * r + 0.7152 * g + 0.0722 * b);
}

function brightnessTuning(hex: string) {
  const L = luminance01_srgb(hex); // 0..1
  const darkBoost = clamp01((0.35 - L) / 0.35); // strong when L < 0.35
  const lightTame = clamp01((L - 0.65) / 0.35); // strong when L > 0.65
  return { L, darkBoost, lightTame };
}

export function buildMaterialPreset(
  archetype: JzButtonMaterialArchetype,
  hex: string
): MaterialBuild {
  const { darkBoost, lightTame } = brightnessTuning(hex);
  const color = new THREE.Color(hex);

  switch (archetype) {
    // -------------------------
    // Plastics / dielectrics
    // -------------------------

    case "bakeliteSatin": {
      // Premium phenolic resin feel: satiny, strong but controlled highlight.
      const rough = clamp01(0.28 + 0.10 * lightTame - 0.06 * darkBoost);
      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.0,
        roughness: rough,
      });
      return { mat };
    }

    case "bakeliteGloss": {
      // Same family, tighter highlight (still single-lobe).
      const rough = clamp01(0.18 + 0.10 * lightTame - 0.05 * darkBoost);
      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.0,
        roughness: rough,
      });
      return { mat };
    }

    case "ceramicSoft": {
      // Ceramic: broader/softer highlight; nice on light colors.
      const rough = clamp01(0.38 + 0.12 * lightTame - 0.05 * darkBoost);
      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.0,
        roughness: rough,
      });
      return { mat };
    }

    case "rubberMatte": {
      // Rubberized/soft-touch: diffuse dominant, muted spec.
      const rough = clamp01(0.60 + 0.15 * lightTame - 0.05 * darkBoost);
      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.0,
        roughness: rough,
      });
      return { mat };
    }

    // -------------------------
    // Metals
    // -------------------------

    case "anodizedMetal": {
      // Colored metal feel but not mirror.
      const rough = clamp01(0.34 + 0.08 * lightTame - 0.04 * darkBoost);
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.85,
        roughness: rough,
        reflectivity: 0.38 - 0.10 * lightTame,
        specularIntensity: 0.55 - 0.15 * lightTame + 0.10 * darkBoost,
        clearcoat: 0.0,
      });
      return { mat };
    }

    case "polishedMetal": {
      // Strong reflections; best with env on.
      const rough = clamp01(0.18 + 0.07 * lightTame - 0.03 * darkBoost);
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 1.0,
        roughness: rough,
        reflectivity: 0.55 - 0.15 * lightTame,
        specularIntensity: 0.75 - 0.20 * lightTame + 0.10 * darkBoost,
        clearcoat: 0.0,
      });
      return { mat };
    }

    // -------------------------
    // Lacquered (two-lobe by design)
    // -------------------------

    case "lacquered": {
      const baseRough = clamp01(0.24 + 0.10 * lightTame - 0.05 * darkBoost);
      const coatRough = clamp01(0.12 + 0.10 * lightTame);

      const mat = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.0,
        roughness: baseRough,
        reflectivity: 0.28 - 0.08 * lightTame,
        specularIntensity: 0.65 - 0.20 * lightTame + 0.10 * darkBoost,
        clearcoat: 0.55 - 0.20 * lightTame,
        clearcoatRoughness: coatRough,
      });
      return { mat };
    }
  }
}
