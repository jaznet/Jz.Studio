import { Injectable, signal } from '@angular/core';

export type SmaPeriod = 20 | 50 | 150;

type SmaVisibility = Record<SmaPeriod, boolean>;

@Injectable({ providedIn: 'root' })
export class SmaVisibilityService {
  private readonly storageKey = 'jz.technical-analysis.sma-visibility.v1';
  private readonly defaultVisibility: SmaVisibility = {
    20: true,
    50: true,
    150: true
  };

  readonly visibility = signal<SmaVisibility>(this.loadVisibility());
  readonly focusedPeriod = signal<SmaPeriod | null>(null);

  isVisible(period: SmaPeriod): boolean {
    return this.visibility()[period];
  }

  toggle(period: SmaPeriod): void {
    const next = {
      ...this.visibility(),
      [period]: !this.visibility()[period]
    };
    this.visibility.set(next);
    if (!next[period] && this.focusedPeriod() === period) {
      this.focusedPeriod.set(null);
    }
    this.persist(next);
  }

  focus(period: SmaPeriod): void {
    if (this.isVisible(period)) {
      this.focusedPeriod.set(period);
    }
  }

  clearFocus(period?: SmaPeriod): void {
    if (period === undefined || this.focusedPeriod() === period) {
      this.focusedPeriod.set(null);
    }
  }

  hasHidden(): boolean {
    return Object.values(this.visibility()).some(visible => !visible);
  }

  restoreAll(): void {
    const next = { ...this.defaultVisibility };
    this.visibility.set(next);
    this.focusedPeriod.set(null);
    this.persist(next);
  }

  private loadVisibility(): SmaVisibility {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return { ...this.defaultVisibility };

      const parsed = JSON.parse(stored) as Partial<Record<SmaPeriod, unknown>>;
      return {
        20: typeof parsed[20] === 'boolean' ? parsed[20] : true,
        50: typeof parsed[50] === 'boolean' ? parsed[50] : true,
        150: typeof parsed[150] === 'boolean' ? parsed[150] : true
      };
    } catch {
      return { ...this.defaultVisibility };
    }
  }

  private persist(visibility: SmaVisibility): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(visibility));
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }
}
