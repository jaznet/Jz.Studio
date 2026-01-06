// src/types/menu.ts

export const MENU_TYPES = ['none', 'main', 'sub', 'secondary', 'utility'] as const;
export type MenuType = typeof MENU_TYPES[number]; // 'main' | 'sub'

export function normalizeMenuType(
  v: unknown,
  fallback: MenuType = 'main'
): MenuType {
  const s = typeof v === 'string' ? v.toLowerCase() : '';
  return s === 'sub' ? 'sub' : 'main';
}
