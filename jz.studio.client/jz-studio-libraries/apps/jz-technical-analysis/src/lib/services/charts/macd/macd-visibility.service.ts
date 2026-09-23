import { Injectable, signal } from '@angular/core';

export type MacdSeries = 'macd' | 'signal' | 'histogram';

type MacdVisibility = Record<MacdSeries, boolean>;

@Injectable({ providedIn: 'root' })
export class MacdVisibilityService {
  private readonly storageKey = 'jz.technical-analysis.macd-visibility.v1';
  private readonly defaultVisibility: MacdVisibility = {
    macd: true,
    signal: true,
    histogram: true
  };

  readonly visibility = signal<MacdVisibility>(this.loadVisibility());
  readonly focusedSeries = signal<MacdSeries | null>(null);

  isVisible(series: MacdSeries): boolean {
    return this.visibility()[series];
  }

  hasHidden(): boolean {
    return Object.values(this.visibility()).some(visible => !visible);
  }

  restoreAll(): void {
    const next = { ...this.defaultVisibility };
    this.visibility.set(next);
    this.focusedSeries.set(null);
    this.persist(next);
  }

  toggle(series: MacdSeries): void {
    const next = {
      ...this.visibility(),
      [series]: !this.visibility()[series]
    };
    this.visibility.set(next);
    if (!next[series] && this.focusedSeries() === series) {
      this.focusedSeries.set(null);
    }
    this.persist(next);
  }

  focus(series: MacdSeries): void {
    if (this.isVisible(series)) {
      this.focusedSeries.set(series);
    }
  }

  clearFocus(series?: MacdSeries): void {
    if (series === undefined || this.focusedSeries() === series) {
      this.focusedSeries.set(null);
    }
  }

  private loadVisibility(): MacdVisibility {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return { ...this.defaultVisibility };

      const parsed = JSON.parse(stored) as Partial<Record<MacdSeries, unknown>>;
      return {
        macd: typeof parsed.macd === 'boolean' ? parsed.macd : true,
        signal: typeof parsed.signal === 'boolean' ? parsed.signal : true,
        histogram: typeof parsed.histogram === 'boolean' ? parsed.histogram : true
      };
    } catch {
      return { ...this.defaultVisibility };
    }
  }

  private persist(visibility: MacdVisibility): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(visibility));
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }
}
