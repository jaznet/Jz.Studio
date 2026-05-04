// jz-nav-item.model.ts

export type JzViewLayoutType =
  | 'blank'
  | 'framed'
  | 'left-nav-framed'
  | 'workspace'
  | 'dashboard';

export interface JzNavItem {
  id: string;
  label: string;
  route: string;
  disabled?: boolean;

}
