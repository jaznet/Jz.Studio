// panel-preference.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PanelPreference } from '../../interfaces/panel-preference.interface';
import { DEFAULT_PANEL_PREFERENCES } from '../../technical-analysis-panel-preferences';
import { ChartType } from '../../enums/chart-type';

@Injectable({
  providedIn: 'root'
})
export class PanelPreferenceService {
  private readonly storageKey = 'jz.technical-analysis.panel-visibility.v1';
  private readonly _preferences = new BehaviorSubject<PanelPreference[]>(
    this.loadPreferences()
  );

  readonly preferences$ = this._preferences.asObservable();

  getPreferences(): PanelPreference[] {
    return [...this._preferences.value]
      .sort((a, b) => a.order - b.order);
  }

  setPreferences(preferences: PanelPreference[]): void {
    const next = preferences.map(preference => ({
      ...preference,
      visible: preference.chartType === ChartType.OHLC ? true : preference.visible
    }));
    this._preferences.next(next);
    this.persistVisibility(next);
  }

  updatePreference(id: string, patch: Partial<PanelPreference>): void {
    const next = this._preferences.value.map(pref =>
      pref.id === id ? { ...pref, ...patch } : pref
    );

    this.setPreferences(next);
  }

  resetToDefaults(): void {
    this.setPreferences([...DEFAULT_PANEL_PREFERENCES]);
  }

  hasHiddenIndicators(): boolean {
    return this._preferences.value.some(preference =>
      preference.chartType !== ChartType.OHLC && !preference.visible
    );
  }

  restoreIndicatorVisibility(): void {
    this.setPreferences(this._preferences.value.map(preference => ({
      ...preference,
      visible: true
    })));
  }

  private loadPreferences(): PanelPreference[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [...DEFAULT_PANEL_PREFERENCES];

      const visibility = JSON.parse(stored) as Record<string, unknown>;
      return DEFAULT_PANEL_PREFERENCES.map(preference => ({
        ...preference,
        visible: preference.chartType === ChartType.OHLC
          ? true
          : typeof visibility[preference.id] === 'boolean'
            ? visibility[preference.id] as boolean
            : preference.visible
      }));
    } catch {
      return [...DEFAULT_PANEL_PREFERENCES];
    }
  }

  private persistVisibility(preferences: readonly PanelPreference[]): void {
    try {
      const visibility = Object.fromEntries(
        preferences.map(preference => [preference.id, preference.visible])
      );
      localStorage.setItem(this.storageKey, JSON.stringify(visibility));
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }
}
