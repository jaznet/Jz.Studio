// src/library/jz-menu/jz-menu-context.token.ts
import { InjectionToken } from '@angular/core';
import { MenuType } from '../../../types/menu';

export interface JzMenuContext {
  menuType: MenuType;
}

export const JZ_MENU_CONTEXT = new InjectionToken<JzMenuContext>('JZ_MENU_CONTEXT');
