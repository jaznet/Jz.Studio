// src/library/jz-menu/jz-menu-context.service.ts
import { Injectable } from '@angular/core';
import type { MenuType } from '../../../types/menu';

@Injectable()
export class JzMenuContextService {
  menuType: MenuType = 'main';
}
