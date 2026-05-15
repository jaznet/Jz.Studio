// shell-theme.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShellThemeService {

  initializeTheme(): void {
    this.applyPalette('onyx'); // your default/startup palette
  }

  applyPalette(paletteName: string): void {
    switch (paletteName) {
      case 'onyx':
      default:
        this.applyOnyxPalette();
        break;
    }
  }

  private applyOnyxPalette(): void {
    const root = document.documentElement;

    root.style.setProperty('--plt-clr-1', '#0B0F14');
    root.style.setProperty('--plt-clr-2', '#111923');
    root.style.setProperty('--plt-clr-3', '#1B2633');
    root.style.setProperty('--plt-clr-4', '#2A3747');
    root.style.setProperty('--plt-clr-5', '#3A4A5E');

    root.style.setProperty('--plt-txt-1', '#F2F5F8');
    root.style.setProperty('--plt-txt-2', '#E2E8EF');
    root.style.setProperty('--plt-txt-3', '#CBD5E1');
    root.style.setProperty('--plt-txt-4', '#AAB7C6');
    root.style.setProperty('--plt-txt-5', '#8C9AAA');

    root.style.setProperty('--plt-pop', '#16C7E8');
    root.style.setProperty('--plt-pop-txt', '#061014');
  }
}
