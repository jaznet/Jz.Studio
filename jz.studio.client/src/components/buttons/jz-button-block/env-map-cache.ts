// env-map-cache.ts

import * as THREE from "three";

class EnvMapCache {
  private map = new Map<string, THREE.Texture>();

  constructor(private readonly build: (envId: string) => THREE.Texture) { }

  get(envId?: string): THREE.Texture | null {
    if (!envId) return null;
    const e = this.map.get(envId);
    if (e) return e;
    const t = this.build(envId);
    this.map.set(envId, t);
    return t;
  }
}
