// jz-button-block-materials.ts
import * as THREE from "three";

export type JzButtonMaterialArchetype =
  | "bakeliteSatin"
  | "bakeliteGloss"
  | "ceramicSatin"
  | "softPlastic"
  | "anodizedMetal"
  | "polishedMetal"
  | "lacquered";

export type MaterialBuild = { mat: THREE.Material };

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function luminance01_srgb(hex: string): number {
  const c = new THREE.Color(hex);
  const srgbToLinear = (u: number) => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4));
  const r = srgbToLinear(c.r);
  const g = srgbToLinear(c.g);
  const b = srgbToLinear(c.b);
  return clamp01(0.2126 * r + 0.7152 * g + 0.0722 * b);
}

function brightnessTuning(hex: string) {
  const L = luminance01_srgb(hex);
  const darkBoost = clamp01((0.35 - L) / 0.35);
  const lightTame = clamp01((L - 0.65) / 0.35);
  return { L, darkBoost, lightTame };
}

export function buildMaterialPreset(archetype: JzButtonMaterialArchetype, hex: string): MaterialBuild {
  const { darkBoost, lightTame } = brightnessTuning(hex);
  const color = new THREE.Color(hex);

  switch (archetype) {
    case "bakeliteSatin": {
      // hard resin, satin
      const rough = clamp01(0.30 + 0.10 * lightTame - 0.06 * darkBoost);
      const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.0, roughness: rough });
      return { mat };
    }

    case "bakeliteGloss": {
      // harder, glossier resin
      const rough = clamp01(0.18 + 0.10 * lightTame - 0.06 * darkBoost);
      const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.0, roughness: rough });
      return { mat };
    }

    case "ceramicSatin": {
      const rough = clamp01(0.40 + 0.12 * lightTame - 0.05 * darkBoost);
      const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.0, roughness: rough });
      return { mat };
    }

    case "softPlastic": {
      const rough = clamp01(0.58 + 0.15 * lightTame - 0.05 * darkBoost);
      const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.0, roughness: rough });
      return { mat };
    }

    case "anodizedMetal": {
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
